import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { Provider } from "../../components/ui/provider";

export function renderWithProvider(element: ReactElement) {
  return render(<Provider>{element}</Provider>);
}
