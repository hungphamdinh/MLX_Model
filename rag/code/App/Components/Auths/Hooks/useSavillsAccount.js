import useUser from '@Context/User/Hooks/UseUser';
import { checkEmailSavills } from '@Utils/regex';

const useSavillsAccount = (email) => {
  const {
    user: { emailRegex, user },
  } = useUser();
  const emailAddress = email || user?.emailAddress;
  const regex = emailRegex.regexEmails ? emailRegex.regexEmails : [];
  return checkEmailSavills(emailAddress, regex);
};

export default useSavillsAccount;
