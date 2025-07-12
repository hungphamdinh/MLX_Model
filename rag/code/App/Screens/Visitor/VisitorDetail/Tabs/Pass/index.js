import React, { useRef } from 'react';
import styled from 'styled-components/native';
import ViewShot from 'react-native-view-shot';
import Share from 'react-native-share';
import I18n from '@I18n';

import { Button } from '@Elements';
import VisitorPass from '@Components/Visitor/VisitorPass';
import useVisitor from '@Context/Visitor/Hooks/UseVisitor';
import useUser from '@Context/User/Hooks/UseUser';

const Wrapper = styled.ScrollView`
  flex: 1;
`;

const VisitorPassTab = () => {
  const {
    visitor: { visitorDetail },
  } = useVisitor();
  const {
    user: { tenant, isOfficeSite },
  } = useUser();

  const viewShotRef = useRef(undefined);

  const btSharePress = async () => {
    const uri = await viewShotRef.current.capture();
    const shareOptions = {
      title: I18n.t('COMMON_SHARE'),
      failOnCancel: false,
      urls: [uri],
    };
    await Share.open(shareOptions);
  };

  if (!visitorDetail) {
    return null;
  }

  return (
    <Wrapper contentContainerStyle={{ paddingHorizontal: 15, paddingVertical: 15 }}>
      <ViewShot ref={viewShotRef} options={{ fileName: 'visitor-pass', format: 'jpg', quality: 0.9 }}>
        <VisitorPass item={visitorDetail} tenant={tenant} />
      </ViewShot>
      <Button title="COMMON_SHARE" primary rounded onPress={btSharePress} containerStyle={{ marginTop: 20 }} />
    </Wrapper>
  );
};

export default VisitorPassTab;
