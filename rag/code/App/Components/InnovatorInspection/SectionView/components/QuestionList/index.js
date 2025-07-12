import { FlashList } from '@shopify/flash-list';
import React from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { FormEditorTypes } from '@Config/Constants';
import { FormItem } from '../FormItems';
const QuestionList = ({
  remove,
  fields,
  setFieldValue,
  name,
  setIsEditItem,
  setSelectedForm,
  workflowGuid,
  isView,
  actionType,
  hadSignature,
  isNonEditable,
  pageEntityChangeType,
  moduleId,
}) => {
  const estimateQuestionSize = useWatch({ name: `estimateQuestionSize` });

  const renderItem = ({ index }) => {
    const formName = `${name}.formQuestions.${index}`;
    return (
      <FormItem
        hadSignature={hadSignature}
        setFieldValue={setFieldValue}
        actionType={actionType}
        formName={formName}
        index={index}
        isNonEditable={isNonEditable}
        pageEntityChangeType={pageEntityChangeType}
        remove={remove}
        setIsEditItem={setIsEditItem}
        setSelectedForm={setSelectedForm}
        workflowGuid={workflowGuid}
        isView={isView}
        moduleId={moduleId}
      />
    );
  };

  return (
    <FlashList
      extraData={{
        name,
        actionType
      }}
      data={fields}
      estimatedItemSize={estimateQuestionSize}
      keyExtractor={(item) => `${item.id}`}
      getItemType={(item) => item.questionType?.id}
      // contentContainerStyle={{ flexGrow: 1 }}
      // extraData={this.state}
      renderItem={renderItem}
    />
  );
};

const QuestionListMemo = React.memo(QuestionList);

const QuestionListContainer = (props) => {
  const { setValue: setFieldValue } = useFormContext();
  return <QuestionListMemo {...props} setFieldValue={setFieldValue} />;
};

export default QuestionListContainer;
