import { Counter } from "./components/Counter";
import { FetchData } from "./components/FetchData";
import { Home } from "./components/Home";
import { TreeTidy } from "./components/TreeTidy";
import { GraphContainer } from "./components/GraphContainer";

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
    element: <GraphContainer/>
  },
  {
    path: '/treetidy',
    element: <TreeTidy/>
  }
];

export default AppRoutes;
