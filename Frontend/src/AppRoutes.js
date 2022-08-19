import { Counter } from "./components/Counter";
import { FetchData } from "./components/FetchData";
import { Home } from "./components/Home";
import { Graph } from "./components/Graph";
import { TreeTidy } from "./components/TreeTidy";

const AppRoutes = [
  {
    index: true,
    element: <Home />
  },
  {
    path: '/counter',
    element: <Counter />
  },
  {
    path: '/fetch-data',
    element: <FetchData />
  },
  {
    path: '/graph',
    element: <Graph/>
  },
  {
    path: '/treetidy',
    element: <TreeTidy/>
  }
];

export default AppRoutes;
