//Responsive

//react
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

//react-icons
import { GiDiamonds } from "react-icons/gi";
import { FaStarOfLife } from "react-icons/fa";
import { LuStar } from "react-icons/lu";


//react-toast
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  showSuccessToast,
  showErrorToast,
} from "../../utils/toastNotifications";

//imgUsed

import brandLogo from "./../../assets/images/brandLogo.png";

import crm from "./../../assets/images/crm.png";

import { getHostnamePart } from "../SIDEBAR/SIDEBAR_SETTING/ReusableComponents/GlobalHostUrl";
import {
  main_base_url,
  protocal_url,
  tenant_base_url,
  urlchange_base,
} from "../../Config/config";

export default function VerifyTenant() {
  const [userName, setuserName] = useState("");

  const name = getHostnamePart();
  console.log("Hostname part:", name);

  useEffect(() => {
    const apiUrl = `${protocal_url}${name}.${tenant_base_url}/Tenants/check`;
    console.log("Constructed API URL:", apiUrl);

    const verifyTenant = async () => {
      try {
        const response = await axios.post(
          apiUrl,
          {
            tenantName: name,
            tenanturl: apiUrl,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        console.log("API Response:", response);
        const { isSuccess } = response.data;

        if (isSuccess) {
          {
            showSuccessToast("Tenant Verified!");
            setTimeout(() => {
              //localhost
              const newUrl = `http://${name}.localhost:5173/tenantlogin`;

              //forServer
              //  const newUrl = `http://${name}.${urlchange_base}/tenantlogin `
              window.location.href = newUrl;
            }, 100);
          }
        } else {
          showErrorToast("Tenant verification failed");
        }
      } catch (error) {
        console.error("Error checking tenant:", error); // Log the error
      }
    };

    verifyTenant();
  }, []);

  function handleusername(e) {
    setuserName(e.target.value);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const emailRegex =
      /^[A-Za-z0-9](([a-zA-Z0-9,=\.!\-#|\$%\^&\*\+/\?_`\{\}~]+)*)@(?:[0-9a-zA-Z-]+\.)+[a-zA-Z]{2,9}$/;

    if (!userName) {
      showErrorToast("Input field is empty");
      return;
    }
    try {
      const response = await axios.post(`${main_base_url}/Tenants/check1`, {
        emailId: userName,
      });

      const { isSuccess, data, message } = response.data;

      if (!isSuccess) {
        showErrorToast(message);
      } else {
        showSuccessToast("Login Successful!");
        setTimeout(() => {
          //localhost
          const newUrl = `http://${data.name}.localhost:5173/tenantlogin`;

          //forServer
          //  const newUrl = `http://${data.name}.${urlchange_base}/tenantlogin `
          window.location.href = newUrl;
        }, 100);
      }
    } catch (error) {
      if (error.response.data) {
        showErrorToast(error);
      }
    }
  }
  return (
    <>
      <ToastContainer />
      <div className="flex h-screen flex-col bg-gray-400 sm:bg-gray-400 md:flex-row">
        {/*----------> Part-I <---------- */}
        <div className=" hidden   w-2/3 flex-col items-center justify-center md:flex   ">
          <div className="flex flex-col items-center justify-center gap-2 rounded-md bg-white  px-6  h-5/6 ">
            <img src={brandLogo} alt="Brandlogo" width={80} height={80} className="shadow-md rounded-full" />
            <img src={crm} alt="sample" className="h-2/4" />
            <div className="flex text-2xl font-semibold">
              <GiDiamonds className="text-emerald-400 text-3xl" />
              <h1>Welcome to the ultimate CRM experience!</h1>
            </div>
            <div>
              <p className="text-center text-sm text-gray-400">
                Let automation handle the analysis—empower
                <br />your stock advisory services for success.
              </p>
            </div>
          </div>
        </div>

        {/*----------> Part-II <---------- */}
        <div className="flex min-h-screen w-full flex-col justify-center bg-gray-400 md:w-1/3 md:bg-white ">
        <div className="bg-white mx-10 py-6 rounded-md ">
          <div className="flex justify-center md:hidden">
            <img src={brandLogo} alt="Logo" className="w-3/12"  />
          </div>

          <div className="mx-10 mt-8 flex flex-col justify-center rounded-2xl  py-3 md:mx-4">
            <div className="flex items-center gap-3 text-2xl font-semibold">
            <GiDiamonds className=" text-3xl rounded-full bg-gray-700  p-1 mt-1 md:block text-emerald-400 " />
              <h1 className="">Verify Tenant</h1>
            </div>

            <div className="mt-6">
              {/*----------> FORM <---------- */}
              <form
                className="flex flex-col gap-2 rounded-md"
                onSubmit={handleSubmit}
              >
                {/*----------> Username <---------- */}
                <label
                  htmlFor="userName"
                  className="text-xs font-medium text-gray-700"
                >
                  <span className="flex text-slate-900 gap-1">
                    Username
                    <FaStarOfLife size={8} className="text-red-400" />
                  </span>
                  <input
                    type="email"
                    name="userName"
                    className="mt-1 flex w-full justify-between rounded-md border border-gray-400 px-2 py-2 text-sm outline-none"
                    value={userName}
                    onChange={handleusername}
                    placeholder="John@company.com"
                  />
                </label>

                <button className="mt-4 rounded-md  py-4 text-xs font-bold text-slate-900 border-2 border-slate-900 outline-none hover:shadow-md">
                  Submit
                </button>
              </form>

              <div className="relative mt-8 text-center">
                <div className="absolute inset-2 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative inline-block bg-white px-4 text-sm">
                  <span className="font-light text-emerald-400">Don’t have an account ?</span>
                </div>
              </div>
            </div>

            <div className="mx-auto my-3 text-sm">
              <span className="font-light">
                <Link to="/registration">
                  <span className="ms-1 block text-center font-semibold  underline underline-offset-2 hover:scale-110 md:inline-block md:font-normal text-emerald-400">
                    Join Us
                  </span>
                </Link>
              </span>
            </div>
          </div>
        </div>
        </div>
      </div>
    </>
  );
}
