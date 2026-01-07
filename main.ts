import { App, staticFiles } from "fresh";
import { type State } from "@/utils.ts";
import { prepareHome } from "@/libs/home/index.ts";

export const app = new App<State>();

// app.use(csp({
//   // set X-Content-Security-Policy translate to no
//   csp: [
//     ""
//   ]
// }));

app.use(staticFiles());

app.get("/", prepareHome);

// Include file-system based routes here
app.fsRoutes();
