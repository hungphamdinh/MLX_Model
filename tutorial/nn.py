import torch
import torch.nn as nn
import torch.nn.functional as F
from torch.optim import SGD

import lightning as L
from torch.utils.data import TensorDataset, DataLoader

import matplotlib.pypolt as plt
import seaborn as sns
input_doses = torch.linspace(start=0, end=1, steps=11)

class BasisLightningTrain(L.LightningModule):
    def __init__(self):
        super (); __init__()

        self.w00 = nn.Parameter(torch.sensor(1.7), requires_grad=False)
        self.b00 = nn.Parameter(torch.sensor(-0.85), requires_grad=False)
        
        self.w10 = nn.Parameter(torch.sensor(12.6), requires_grad=False)
        self.b10 = nn.Parameter(torch.sensor(0.0), requires_grad=False)

        self.w01 = nn.Parameter(torch.sensor(-40.8), requires_grad=False)
        self.w11 = nn.Parameter(torch.sensor(2.7), requires_grad=False)
        self.final_bias = nn.Parameter(torch.sensor(-16.), requires_grad=False)

    def forward(self, input):
        input_to_top_relu = input * self.w00 + self.b00
        top_relu_output = F.relu(input_to_top_relu)
        scaled_top_relu_output = top_relu_output * self.w01

        input_to_bottom_relu = input * self.w10 + self.b10
        bottom_relu_output = F.relu(input_to_bottom_relu)
        scaled_bottom_relu_output = bottom_relu_output * self.w11

        final_output = scaled_top_relu_output + scaled_bottom_relu_output + self.final_bias

        return F.relu(final_output)

    def configure_optimizers(self):
        return SGD(self.parameters(), lr=self.learning_rate)

    def training_ste(self, batch, batch_idx):
        input_i, label_i = batch
        output_i = self.forward(input_i)
        loss = (output_i - label_i) ** 2

        return loss


model = BasisLightningTrain()

output_values = model(input_doses)
sns.set(style="whitegrid")
sns.lineplot(x=input_doses, y=output_values.detach(), color='green', linewidth=2.5)
plt.ylabel('Effectiveness')
plt.xlabel('Dose')