import App from "./App";
import { AdminViewProvider } from "./hooks/useAdminView";
export default function Page() {
  return (
    <AdminViewProvider>
      <App />
    </AdminViewProvider>
  );
}
