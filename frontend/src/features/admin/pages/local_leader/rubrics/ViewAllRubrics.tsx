import ViewAllRubricsTemplateView from '../../../../rubrics/components/ViewAllRubricsTemplateView';
import { LocalLeaderAuthGuard } from '../../../Middleware/auth';
export default function ViewRubricsTemplate() {
  return (
    <LocalLeaderAuthGuard>
      <ViewAllRubricsTemplateView />
    </LocalLeaderAuthGuard>
  );
}
