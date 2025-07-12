# Copyright © 2023-2024 Apple Inc.

import glob
import json
import logging
from pathlib import Path
from typing import Any, Dict, Generator, Union, List, Tuple

import mlx.core as mx
import mlx.nn as nn
import models
import transformers
from huggingface_hub import snapshot_download
from langchain_community.vectorstores import Chroma
from langchain.schema import Document
from rag.get_embedding_function import get_embedding_function
from sentence_transformers import CrossEncoder

RETRIEVAL_METHOD = 'mmr'
CHROMA_PATH = './rag/chroma'
def fetch_from_hub(hf_path: str):
    model_path = snapshot_download(
        repo_id=hf_path,
        allow_patterns=["*.json", "*.safetensors", "tokenizer.model"],
    )
    weight_files = glob.glob(f"{model_path}/*.safetensors")
    if len(weight_files) == 0:
        raise FileNotFoundError("No safetensors found in {}".format(model_path))

    weights = {}
    for wf in weight_files:
        weights.update(mx.load(wf).items())

    config = transformers.AutoConfig.from_pretrained(hf_path)
    tokenizer = transformers.AutoTokenizer.from_pretrained(
        hf_path,
    )
    return weights, config.to_dict(), tokenizer


def upload_to_hub(path: str, name: str, hf_path: str):
    import os

    from huggingface_hub import HfApi, ModelCard, logging

    repo_id = f"mlx-community/{name}"

    card = ModelCard.load(hf_path)
    card.data.tags = ["mlx"] if card.data.tags is None else card.data.tags + ["mlx"]
    card.text = f"""
# {name}
This model was converted to MLX format from [`{hf_path}`]().
Refer to the [original model card](https://huggingface.co/{hf_path}) for more details on the model.
## Use with mlx
```bash
pip install mlx
git clone https://github.com/ml-explore/mlx-examples.git
cd mlx-examples/llms/hf_llm
python generate.py --model {repo_id} --prompt "My name is"
```
"""
    card.save(os.path.join(path, "README.md"))

    logging.set_verbosity_info()

    api = HfApi()
    api.create_repo(repo_id=repo_id, exist_ok=True)
    api.upload_folder(
        folder_path=path,
        repo_id=repo_id,
        repo_type="model",
        multi_commits=True,
        multi_commits_verbose=True,
    )


def make_shards(weights: dict, max_file_size_gibibyte: int = 15):
    max_file_size_bytes = max_file_size_gibibyte << 30
    shards = []
    shard: Dict[str, mx.array] = {}
    shard_size = 0
    for k, v in weights.items():
        if shard_size + v.nbytes > max_file_size_bytes:
            shards.append(shard)
            shard, shard_size = {}, 0
        shard[k] = v
        shard_size += v.nbytes
    shards.append(shard)
    return shards


def save_model(save_dir: Union[str, Path], weights, tokenizer, config):
    save_dir = Path(save_dir)
    save_dir.mkdir(parents=True, exist_ok=True)

    shards = make_shards(weights, max_file_size_gibibyte=5)
    shards_count = len(shards)
    shard_file_format = (
        "model-{:05d}-of-{:05d}.safetensors"
        if shards_count > 1
        else "model.safetensors"
    )

    total_size = sum(v.nbytes for v in weights.values())
    index_data: Dict[str, Any] = {
        "metadata": {"total_size": total_size},
        "weight_map": {},
    }

    for i, shard in enumerate(shards):
        shard_name = shard_file_format.format(i + 1, shards_count)
        mx.save_safetensors(
            str(save_dir / shard_name), shard, metadata={"format": "mlx"}
        )
        for weight_name in shard.keys():
            index_data["weight_map"][weight_name] = shard_name
        del shard

    tokenizer.save_pretrained(save_dir)
    with open(save_dir / "config.json", "w") as fid:
        json.dump(config, fid, indent=4)

    index_data["weight_map"] = {
        k: index_data["weight_map"][k] for k in sorted(index_data["weight_map"])
    }
    with open(save_dir / "model.safetensors.index.json", "w") as f:
        json.dump(
            index_data,
            f,
            indent=4,
        )


def load(path_or_hf_repo: str, tokenizer_config={}):
    # If the path exists, it will try to load model form it
    # otherwise download and cache from the hf_repo and cache
    model_path = Path(path_or_hf_repo)
    if not model_path.exists():
        model_path = Path(
            snapshot_download(
                repo_id=path_or_hf_repo,
                allow_patterns=["*.json", "*.safetensors", "tokenizer.model"],
            )
        )

    with open(model_path / "config.json", "r") as f:
        config = json.loads(f.read())
        quantization = config.get("quantization", None)

    weight_files = glob.glob(str(model_path / "*.safetensors"))
    if len(weight_files) == 0:
        raise FileNotFoundError("No safetensors found in {}".format(model_path))

    weights = {}
    for wf in weight_files:
        weights.update(mx.load(wf).items())

    model_args = models.ModelArgs.from_dict(config)
    model = models.Model(model_args)
    if quantization is not None:
        class_predicate = (
            lambda p, m: isinstance(m, (nn.Linear, nn.Embedding))
            and f"{p}.scales" in weights
        )
        nn.quantize(
            model,
            **quantization,
            class_predicate=class_predicate,
        )

    model.load_weights(list(weights.items()))

    mx.eval(model.parameters())
    tokenizer = transformers.AutoTokenizer.from_pretrained(
        model_path, **tokenizer_config
    )
    return model, tokenizer, config


def generate(
    prompt: mx.array, model: nn.Module, temp: float = 0.0
) -> Generator[mx.array, None, None]:
    """
    Generate text based on the given prompt and model.

    Args:
        prompt (mx.array): The input prompt.
        model (nn.Module): The model to use for generation.
        temp (float): The temperature for sampling. If temp is 0, use max sampling.

    Yields:
        mx.array: The generated text.
    """

    def sample(logits: mx.array) -> mx.array:
        return (
            mx.argmax(logits, axis=-1)
            if temp == 0
            else mx.random.categorical(logits * (1 / temp))
        )

    y = prompt
    cache = None
    while True:
        logits, cache = model(y[None], cache=cache)
        logits = logits[:, -1, :]
        y = sample(logits)
        yield y

def retrieve_documents(query: str, k: int = 10) -> List[str]:
    """
    1) embed the user query
    2) run either similarity‐search or MMR _with_score_ against the Chroma store
    3) print out each doc’s score and its metadata['id']
    4) return the top-k passages as plain text
    """
    # 1) embed the user query
    embed_fn = get_embedding_function()
    emb = embed_fn.embed_query(query)

    # 2) init Chroma
    db = Chroma(persist_directory=CHROMA_PATH, embedding_function=embed_fn)

    # 3) choose retrieval method, but use the “with_score” variants
    if RETRIEVAL_METHOD == 'similarity':
        # returns List[Tuple[Document, float]]
        docs_and_scores: List[Tuple[Document, float]] = \
            db.similarity_search_with_score(emb, k=k)
    else:
        # if this exists:
        try:
            docs_and_scores = db.max_marginal_relevance_search_by_vector_with_score(
                emb, k=k, fetch_k=100, lambda_mult=0.7
            )
        except AttributeError:
            # fallback: pull distances from the raw client and then apply MMR yourself
            results = db._collection.query(
                query_embeddings=[emb],
                n_results=k,
                include=["documents", "metadatas", "distances"],
                # if you need MMR, you’d normally do that here by re‐ranking
            )
            documents = results["documents"][0]
            metadatas = results["metadatas"][0]
            distances = results["distances"][0]
            # assume cosine distance; convert to similarity
            docs_and_scores = [
                (Document(page_content=doc, metadata=md), 1.0 - dist)
                for doc, md, dist in zip(documents, metadatas, distances)
            ]
    print(f"[RAG] Retrieval method={RETRIEVAL_METHOD!r}, query={query!r}")
    print(f"[RAG] Retrieved {len(docs_and_scores)} docs_and_scores entries")
    # 4) print score & source id
    for doc, _ in docs_and_scores:
        src = doc.metadata.get("id", "<no-id>")
        print(f"Source: {src}")

    # 5) optional Cross-Encoder reranking
    try:
        reranker = CrossEncoder("cross-encoder/ms-marco-MiniLM-L-6-v2")
        pairs = [(query, doc.page_content) for doc, _ in docs_and_scores]
        rerank_scores = reranker.predict(pairs)
        # sort by rerank_scores descending and take top k
        reranked = sorted(
            zip([doc for doc, _ in docs_and_scores], rerank_scores),
            key=lambda x: -x[1],
        )[:k]
        docs_and_scores = [(doc, score) for doc, score in reranked]
        print("[RAG] After Cross-Encoder reranking:")
        for doc, score in docs_and_scores:
            rid = doc.metadata.get("id", "<no-id>")
            print(f"Reranked Source: {rid} (score={score:.4f})")
    except Exception as e:
        print(f"[RAG] Reranking failed: {e}")
    # 5) return just the text
    return [doc.page_content for doc, _ in docs_and_scores]