import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import { main_base_url } from "./../../Config/config";


import { TbRosetteDiscountCheckFilled } from "react-icons/tb";
import { GiDiamonds } from "react-icons/gi";


import WelcomeResponsive from "./../../assets/images/WelcomeResponsive.png";

const WelcomePage = () => {
  const navigate = useNavigate();
  const { tenantId } = useParams();
  const [welcomedata, setWelcomeData] = useState({});
  const [condition, setCondition] = useState(false); // State to track the condition

  const handleClick = () => {
    if (!condition) {
      setCondition(true);
      navigate("/tenantlogin"); // Set condition to true on first click
    } else {
      navigate("/desired-path"); // Replace '/desired-path' with the path you want to navigate to
    }
  };

  useEffect(() => {
    const fetchWelcomeData = async () => {
      try {
        const response = await axios.get(
          `${main_base_url}/Tenants/tenantuser/${tenantId}`,
        );
        const tenantWithUsers = response.data.tenantWithUsers;
        setWelcomeData(tenantWithUsers);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem(
          "registrationdata",
          JSON.stringify(tenantWithUsers),
        );
        localStorage.setItem(
          "userDetail",
          JSON.stringify({
            firstName: tenantWithUsers.firstName,
            lastName: tenantWithUsers.lastName,
          }),
        );
      } catch (error) {
        console.error("Error fetching welcome data:", error);
      }
    };

    if (tenantId) {
      fetchWelcomeData();
    } else {
      console.error("No tenantId found in URL parameters.");
    }
  }, [tenantId]); // Fetch data when tenantId changes

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-400">
      <div className="mx-6  w-full rounded-3xl bg-white py-6 shadow-lg sm:w-2/3 lg:w-1/3">
        <div className="relative w-full">
          <div className="flex justify-center ">
            <div className="flex gap-2 items-center text-xl font-extrabold text-slate-900  sm:text-2xl relative">
               

              Registration Successful! 
              <TbRosetteDiscountCheckFilled className="text-emerald-400"/>
              <TbRosetteDiscountCheckFilled className="absolute right-0 text-emerald-600  animate-ping"/>
            </div>
          </div>
            <img src= {WelcomeResponsive} width={400} className="mx-auto"/>

          <div className="">
           

          <p  className="text-slate-900 mx-4 indent-6 italic">
            Welcome to the hassle-free, responsive Advisory CRM – designed
             to simplify your client management and streamline your advisory services.
            </p>
          
          <div className="flex items-center justify-center mt-3">
            <button
              onClick={handleClick}
              className="mx-4 w-full rounded-md  py-4 text-xs font-bold text-slate-900 border-2 border-slate-900 outline-none hover:shadow-md">

              Let's Get Started, {welcomedata.firstName}{" "}{welcomedata.lastName}
          
            </button>
          </div>
        
        </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
