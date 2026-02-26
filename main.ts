import { App, staticFiles } from "fresh";
import { type State } from "@/utils.ts";

export const app = new App<State>();

// app.use(csp({
//   // set X-Content-Security-Policy translate to no
//   csp: [
//     ""
//   ]
// }));

app.use(staticFiles());

// Include file-system based routes here
app.fsRoutes();
