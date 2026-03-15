import { useTranslation } from 'react-i18next';
import CarparkView from './CarparkView';
import LayoutPage from '../Templates/LayoutPage';

const CarparkOverview = () => {
  const { t } = useTranslation();

  return (
    <LayoutPage
      title={t('carparkTitle')}
      helpText={t('carparkHelp')}
      useGenericBackButton={true}
      withPaddingX={true}
    >
      <CarparkView />
    </LayoutPage>
  );
};

export default CarparkOverview;
