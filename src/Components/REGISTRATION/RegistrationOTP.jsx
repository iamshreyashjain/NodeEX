import axios from "axios";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  main_base_url,
  localBase,
  urlchange_base,
} from "../../Config/config";

//images

import companyUploadIMG from "./../../assets/images/companyUploadIMG.png";
import brandLogo from "./../../assets/images/brandLogo.png";
import CRMRegistrationPage from "./../../assets/images/CRMRegistrationPage.png";


//icons
import { MdOutlineCloudUpload } from "react-icons/md";
import { GiDiamonds } from "react-icons/gi";
import { ToastContainer } from "react-toastify";
import { IoMailUnreadOutline } from "react-icons/io5";
import { ImCancelCircle } from "react-icons/im";


import "react-toastify/dist/ReactToastify.css";
import {
  showSuccessToast,
  showErrorToast,
} from "../../utils/toastNotifications";
import { FaStarOfLife } from "react-icons/fa";

const RegistrationOTP = () => {
  const { userId } = useParams();
  const [otp, setOtp] = useState("");

  const [countdown, setCountdown] = useState(60);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [base64Image, setBase64Image] = useState("");
  const [emailreg, setEmailreg] = useState("");

  const [resendDisabled, setResendDisabled] = useState(true); // Initialize to true

  useEffect(() => {
    const registration = JSON.parse(localStorage.getItem("registrationdata"));
    if (registration && registration.data && registration.data.email) {
      // console.log(registration.data.email)
      setEmailreg(registration.data.email);
    } else {
      console.error("Registration data or email is not available.");
    }
  }, []);

  // Countdown logic for OTP resend
  useEffect(() => {
    let timer;
    if (resendDisabled) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(timer);
            setResendDisabled(false); // Re-enable resend after countdown finishes
            return 120;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendDisabled]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setBase64Image(event.target.result.split(",")[1]);
        document.getElementById("profileImage").src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    document.getElementById("imageInput").click();
  };

  //OTP Handler ----> Submit Button
  const handleSubmit = async (event) => {
    event.preventDefault();
    //validation Added for OTP
    if (otp.length < 1) {
      showErrorToast("Please enter OTP");
    } else if (otp.length > 6) {
      showErrorToast("OTP cannot be more than 6 digits");
    } else if (otp.length < 6) {
      showErrorToast("OTP cannot be less than 6 digits");
    }

    const formValues = {
      emailid: emailreg,
      otp: otp,
    };

    try {
      const response = await axios.post(
        `${main_base_url}/Users/verify/otp`,
        formValues,
      );
      if (response.data.status === 200) {
        // Toggle the modal to open it
        toggleModal();
      }
    } catch (error) {
      showErrorToast(error.response.data.message);
    }
  };

  //OTP Handler ----> Resend Button
  const handleResend = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(`${main_base_url}/Users/send/otp`, {
        Email: emailreg,
      });
      if (response.data.status === 200) {
        setResendDisabled(true);
      } else {
        alert("Failed to resend OTP");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to resend OTP: " + error.message);
    }
  };

  //Company Name + Img Verification form SUBMIT
  const handleUpload = async (e) => {
    e.preventDefault();
    const businessType = localStorage.getItem("registrationBusinessType");
    const formData = {
      userId: userId,
      name: companyName?.replace(/\s+/g, ""),
      host: companyName?.replace(/\s+/g, "") + ".copulaa.com",
      tenentLogo: base64Image,
      connectionString: "string",
      tenantEmail: emailreg,
      domain: "",
      bussinessType: businessType,
    };
    try {
      const response = await axios.post(`${main_base_url}/Tenants`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(response.data);
      const data = response.data;
      if (data.isSuccess === false) {
        // console.log('Success:', response.data.tenantId);
        showErrorToast(data.message);
      } else {
        showSuccessToast("Company Added Successfully");
        localStorage.setItem("companyData", JSON.stringify(data));
        localStorage.setItem("myData", response.data.tenantId);
        const host = response.data.tenant.host;
        console.log(response);

        const tenantId = response.data.tenant.tenantId;

        //localhost
        const newUrl = `http://${host.split(".")[0]}.${localBase}/welcome/${tenantId}`;

        //forServer
        // const newUrl = `http://${host.split('.')[0]}.${urlchange_base}/welcome/${tenantId}`;

        window.location.href = newUrl;
        // console.log(newUrl)
      }
    } catch (error) {
      console.error("Error:", error.response.data.errors.tenant);
      showSuccessToast(error.response.data.errors.tenant);
    }
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <>
      <ToastContainer />
      {isModalOpen && (
        <Modal
          companyName={companyName}
          setCompanyName={setCompanyName}
          base64Image={base64Image}
          handleImageClick={handleImageClick}
          handleImageChange={handleImageChange}
          handleUpload={handleUpload}
          toggleModal={toggleModal}
        />
      )}

      <div className="flex min-h-screen items-center justify-center bg-gray-400">
        <div className="hidden w-2/3 items-center justify-center md:flex">
          <WelcomeSection />
        </div>
        <div className="flex min-h-screen w-full items-center justify-center md:w-1/3 md:bg-white">
          <OtpForm
            otp={otp}
            setOtp={setOtp}
            resendDisabled={resendDisabled}
            countdown={countdown}
            handleResend={handleResend}
            handleSubmit={handleSubmit}
            emailreg={emailreg}
          />
        </div>
      </div>
    </>
  );
};


{/*----------> CONTROLLER <---------- */ }
const WelcomeSection = () => (
  <div className="flex min-h-screen flex-col bg-gray-400 sm:bg-gray-400 md:flex-row">
    <div className=" hidden min-h-screen flex-col items-center justify-center md:flex ">
      <div className="flex flex-col items-center justify-center gap-2 rounded-md bg-white py-6 px-20">
        <img
          src={brandLogo}
          alt="Brandlogo"
          width={80}
          height={80}
          className="shadow-md rounded-full" />

        <img src={CRMRegistrationPage} alt="sample" width={330} />
        <div className="flex text-2xl font-semibold">
          <GiDiamonds className="text-emerald-400 text-3xl" />
          <h1>You're Just One Step Ahead</h1>
        </div>
        <div>
          <p className="text-center text-sm text-gray-400">

            Maximize the potential of your advisory services with
            <br />
            automation that scales and adapts to market changes.
          </p>
        </div>
      </div>
    </div>
  </div>
);

const OtpForm = ({
  otp,
  setOtp,
  resendDisabled,
  countdown,
  handleResend,
  handleSubmit,
  emailreg,
}) => (
  <div className="md:w-3/3 flex min-h-screen w-full flex-col justify-center bg-gray-400 md:bg-white">
    <div className="bg-white mx-6 rounded-md py-3"> 
    <div className="flex justify-center md:hidden">
      <img src={brandLogo} alt="sample" width={100} height={50} />
    </div>
    <div className="mx-10 mt-8 flex flex-col justify-center rounded-2xl bg-white px-3 py-3 md:mx-4">
      <div className="flex items-center gap-3 text-2xl font-semibold">
        <GiDiamonds className=" text-3xl rounded-full bg-gray-700  p-1 mt-1 md:block text-emerald-400 " />
        <h1 className="">Verify your One Time Password</h1>
      </div>



      <div className="mt-8 md:mt-16">
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="mb-2 flex gap-2 items-center">
            < IoMailUnreadOutline size={20} />
            <span>{emailreg}</span>
          </div>
          <input
            type="number"
            className="h-10 rounded-md border px-3 text-sm focus:outline-none border-gray-400"
            placeholder="XXXXXX"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <div className="mt-3 flex items-center justify-between">
            <div
              className={`cursor-pointer text-left text-sm text-slate-900 ${resendDisabled ? "cursor-not-allowed opacity-50" : "text-emerald-400 underline"
                }`}
              onClick={!resendDisabled ? handleResend : null}
            >
              {resendDisabled ? `Resend in ${countdown}s` : "Resend"}
            </div>
            <div className="text-right text-sm"></div>
          </div>
          <div className="mt-12">
            <button
              type="submit"
              className="mt-4 w-full rounded-md  py-4 text-xs font-bold text-slate-900 border-2 border-slate-900 outline-none hover:shadow-md">
              Verify
            </button>
          </div>
        </form>
      </div>
    </div>
    </div>
  </div>
);


{/* COMPANY DETAILS FORMS */ }

const Modal = ({
  companyName,
  setCompanyName,
  base64Image,
  handleImageClick,
  handleImageChange,
  handleUpload,
  toggleModal,
}) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
    {/*Change padding form here */}
    <div className=" w-full mx-8 rounded-lg bg-white py-6 px-8 md:w-2/3 lg:w-1/3">
      <div className="sm:text-2-xl  flex  items-center">

        <ImCancelCircle onClick={toggleModal}
          className="text-red-400 text-xl rounded-full hover:shadow-md"
        />
        <span className="mx-auto">Upload Compnay Logo Here </span>
      </div>
        

      <form
        onSubmit={handleUpload}
        className="flex flex-col items-center gap-6"
      >
        <div className="flex w-full flex-col gap-8">
          <input
            id="imageInput"
            type="file"
            onChange={handleImageChange}
            accept="image/*"
            hidden
          />
         <div className="sm:text-2xl flex items-center">
  {!base64Image && !companyUploadIMG ? (
    // When no image is uploaded, show the upload icon and text
    <MdOutlineCloudUpload
      onClick={handleImageClick}
      className="mx-auto rounded-full border-b-2 shadow-sm border-gray-300 p-3 text-emerald-300 hover:shadow-md"
      size={90}
    />
  ) : (
    // When image is uploaded, show the uploaded company logo
    <img
      id="profileImage"
      src={companyUploadIMG} // Only show the company upload image
      alt="Company Logo"
      onClick={handleImageClick}
      className="mx-auto w-24 p-2 rounded-full border-b hover:shadow-sm border-gray-300 text-center"
    />
  )}
</div>



          <div className="text-center text-sm  text-slate-900">
            Formtes : JPEG / PNG
          </div>
          <label
            htmlFor="companyName"
            className="text-sm font-medium text-gray-700"
          >
            <span className="flex gap-1">
              Registered Company Name
              <FaStarOfLife size={7} className="text-red-400" />
            </span>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="mb-4 w-full rounded-md border p-2 outline-none border-gray-400 mt-1"
            />
          </label>
        </div>
        <button
          type="submit"
          className="w-full  rounded-md  py-4 text-xs font-bold text-slate-900 border-2 border-slate-900 outline-none hover:shadow-md">
          Submit
        </button>
      </form>
    </div>
  </div>
);

export default RegistrationOTP;
