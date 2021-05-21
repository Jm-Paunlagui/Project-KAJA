import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";

export default function Navbar() {
  let history = useHistory();
  return (
    <header className="flex-none relative z-50 text-sm leading-6 font-medium bg-gray-800 ring-1 ring-gray-900 ring-opacity-5 shadow-sm py-5 overflow-hidden">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 flex items-center  flex-wrap sm:flex-nowrap ">
        <a href="/" className="flex-none text-gray-900">
          <span className="sr-only">Electric Bill Calculator</span>
          <img
            className="h-8 w-auto sm:h-10"
            src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
          />
        </a>
        <p className="hidden lg:block text-sm text-white font-normal xl:border-l xl:border-gray-200 ml-3 xl:ml-4 xl:pl-4 xl:py-0.5">
          <span className="hidden xl:inline">ELECTRICITY BILL CALCULATOR</span>
          <span className="xl:hidden">ELECTRICITY BILL CALCULATOR</span>
        </p>
        <div className="text-white w-full flex-none mt-4 sm:mt-0 sm:w-auto sm:ml-auto flex items-center">
          
          <a
            onClick={() => {
              history.push("/calculate");
            }}
            className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
          >
            <span className="hidden sm:inline">CALCULATOR</span>
          </a>

          <a
            onClick={() => {
              history.push("/history");
            }}
            className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
          >
            COMPUTATION HISTORY
          </a>
          <a
            className="group border-l pl-6 border-gray-200 flex items-center text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 text-sm font-medium"
            onClick={() => {
              Cookies.remove("token");
              toast.error(`You've successfully signed out`);
              history.push("/");
            }}
          >
            Sign out
            <svg
              width="11"
              height="10"
              fill="none"
              class="flex-none ml-1.5 text-gray-400 group-hover:text-teal-600"
            >
              <path
                d="M5.593 9.638L10.232 5 5.593.36l-.895.89 3.107 3.103H0v1.292h7.805L4.698 8.754l.895.884z"
                fill="currentColor"
              />
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
}
