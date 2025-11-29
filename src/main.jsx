import { StrictMode } from 'react'
import ReactDOM from "react-dom/client"; 
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Signin from './Components/Logins/Signin.jsx';
import Dashboard from './Components/DashBoard/Dashboard.jsx';
import AddDashboard from './Components/AddSampleDashboard/AddDashboard.jsx'
import EditSample from './Components/EditSampleDashboard/EditSample.jsx'
import PreSign from './Components/BeforSign/PreSign.jsx'
import Guide from './Components/Guidelines/Guide.jsx'
import SampleDetails from './Components/SampleDetails/SampleDetails.jsx';
import Feature from './Components/TestsSection/Test.jsx'
import Storage from './Components/StorageSection/Storage.jsx'
import Maintenece from './Maintenece.jsx';
import ChemHome from './Components/ChemicalSection/ChemHome.jsx';
import ChemicalRequestPage from './Components/RequestForm/Request.jsx';
import SampleMenu from './Components/SampleMenu/SampleMenu.jsx';
import SampleIn from './Components/SampleIn/SampleIn.jsx'
import SampleAssign from './Components/SampleAssigns/Assign.jsx';
 import Sampleout from './Components/SampleOuts/Sampleout.jsx'
import PublicSample from './Components/PublicSample.jsx';
import Chat from './Components/Chatbot/Chat.jsx'
import 'leaflet/dist/leaflet.css';

import Locations from './Components/LocationsSample/Locations.jsx';
const router = createBrowserRouter([

  {
    path:"/",
    element: <App/>,
  },
   {
    path:"/location",
    element: <Locations/>,
  },
    {
    path:"/sign",
    element: <Signin />,
  },
    {
    path:"/dashboard",
    element: <Dashboard />,
  },
   {
    path:"/addDashboard",
    element: <AddDashboard />,
  },
   {
    path:"/editDashboard",
    element: <EditSample />,
  },
   {
    path:"/preSign",
    element: <PreSign />,
  },
  {
    path:"/guide",
    element: <Guide />,
  },
  {
    path:"/sample-details",
    element: <SampleDetails />,
  },
   {
    path:"/test",
    element: <Feature />,
  },
   {
    path:"/ChemHome",
    element: <ChemHome />,
  },
   {
    path:"/storage",
    element: <Storage />,
  },
    {
    path:"/purchasing",
    element: <ChemicalRequestPage />,
  },
   {
    path:"/cushome",
    element: <SampleMenu />,
  },
    {
    path:"/samplein",
    element: <SampleIn />,
  },
   {
    path:"/sampleassign",
    element: <SampleAssign />,
  },
   {
    path:"/sampleout",
    element: <Sampleout />,
  },
   {
    path:"/chatbot",
    element: <Chat />,
  },
  
   {
    path:"/samples/public/:id",
    element: <PublicSample />,
  },
]);



const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <RouterProvider router={router} />
);

