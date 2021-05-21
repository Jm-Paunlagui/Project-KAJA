import React, { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { toast } from "react-toastify";
import NavBar from "./Navbar";
import Cookies from "js-cookie";

const Home = ({ history }) => {
  const token = Cookies.get("token");
  console.log(token);

  const [formData, setFormData] = useState({
    kWh: "",
    generationcharge: "",
    transmission: "",
    systemlosscharge: "",
    distributioncharge: "",
    lifelinediscount: "",
    valueaddedtax: "",
    universalcharge: "",
    fitall: "",
    price: "",
    textChange: "Calculate",
    textChange1: "Save",
    readOnly: false,
  });

  const {
    kWh,
    generationcharge,
    transmission,
    systemlosscharge,
    distributioncharge,
    lifelinediscount,
    valueaddedtax,
    universalcharge,
    fitall,
    price,
    textChange,
    textChange1,
    readOnly,
  } = formData;

  const handleChange = (text) => (e) => {
    setFormData({ ...formData, [text]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (kWh) {
      axios
        .post(`http://127.0.0.1:5000/calculate`, {
          kWh,
        })
        .then((res) => {
          setFormData({
            ...formData,
            kWh: kWh,
            generationcharge: "PHP " + res.data.generation_charge,
            transmission: "PHP " + res.data.transmission,
            systemlosscharge: "PHP " + res.data.system_loss_charge,
            distributioncharge: "PHP " + res.data.distribution_charge,
            lifelinediscount: "PHP " + res.data.lifeline_discount,
            valueaddedtax: "PHP " + res.data.value_added_tax,
            universalcharge: "PHP " + res.data.universal_charge,
            fitall: "PHP " + res.data.fit_all,
            price: "PHP " + res.data.price,
            textChange: "Calculated!",
            readOnly: true,
          });
          toast.info("Calculated!, Estimated Total Price: " + "PHP " + res.data.price);
        })
        .catch((err) => {
          toast.error("Something went wrong with " + err);
        });
    } else {
      return toast.error("Invalid input");
    }
  };

  const handleSave = (e) => {
    e.preventDefault();

    if (kWh === "" || price === "") {
      toast.warn("You need to calculate first before saving");
    } else {
      setFormData({ ...formData, textChange1: "Saving" });
      axios
        .post(`http://127.0.0.1:5000/save/computation`, {
          kWh,
          price,
        })
        .then((res) => {
          toast.success(res.data.message);
          setFormData({ ...formData, textChange1: "Saved!" });
        })
        .catch((err) => {
          toast.error("Something went wrong with " + err);
        });
    }
  };

  const handleReset = (e) => {
    e.preventDefault();
    if (kWh === "") {
      toast.warn(
        "It's already reset, Please enter your registered kWh on your bill"
      );
    } else {
      setFormData({
        ...formData,
        kWh: "",
        generationcharge: "",
        transmission: "",
        systemlosscharge: "",
        distributioncharge: "",
        lifelinediscount: "",
        valueaddedtax: "",
        universalcharge: "",
        fitall: "",
        price: "",
        textChange: "Calculate",
        textChange1: "Save",
        readOnly: false,
      });
      toast.info("Reset Successful");
    }
  };

  return (
    <>
      <NavBar />
      <div className="bg-gray-100 overflow-hidden">
        {token && token != " " && token != undefined
          ? null
          : history.push(
              "/login",
              toast.warn("OOPS!, Session Expired! Sign in Required")
            )}
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <div className="px-12 sm:px-6">
              <div className="mt-8 flex flex-col items-center">
                <h1 className="text-4xl xl:text-6xl font-extrabold mt-16">
                  Calculator
                </h1>
                <div className="w-full flex-1 text-indigo-500">
                  <div className="my-4 border-b text-center">
                    <div className="leading-none px-2 inline-block tracking-wide font-medium bg-gray-50 transform translate-y-1/4"></div>
                  </div>

                  <form className="mx-auto max-w-xs relative">
                    <label
                      htmlFor="kWh"
                      className="mt-8 block text-m font-medium text-gray-700"
                    >
                      Power Consumed
                    </label>
                    <input
                      className="mt-2 w-full px-8 py-4 rounded-lg font-medium bg-gray-50 border border-gray-200 placeholder-gray-500 text-m focus:outline-none focus:border-gray-400 focus:bg-white"
                      type="number"
                      placeholder="kWh"
                      disabled={readOnly}
                      id="kWh"
                      onChange={handleChange("kWh")}
                      value={kWh}
                    />

                    <label
                      htmlFor="price1"
                      className="mt-4 block text-m font-medium text-gray-700"
                    >
                      Estimated Total Price
                    </label>

                    <input
                      className="mt-2 w-full px-8 py-4 rounded-lg font-medium bg-gray-50 border border-gray-200 placeholder-gray-500 text-m focus:outline-none"
                      type="text"
                      id="price1"
                      placeholder="PHP --.--"
                      readOnly="readonly"
                      onChange={handleChange("price")}
                      value={price}
                    />
                    <button
                      onClick={handleSubmit}
                      className="mt-5 tracking-wide font-semibold bg-indigo-500 text-white w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <i className="fas fa-calculator w-6-ml-2" />
                      <span className="ml-3 text-center">{textChange}</span>
                    </button>

                    <button
                      onClick={handleSave}
                      className="mt-5 tracking-wide font-semibold bg-green-500 text-white w-full py-4 rounded-lg hover:bg-green-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      <i className="fas fa-save w-6-ml-2" />
                      <span className="ml-3 text-center">{textChange1}</span>
                    </button>
                    <button
                      onClick={handleReset}
                      className="mt-5 mb-24 tracking-wide font-semibold bg-red-500 text-white w-full py-4 rounded-lg hover:bg-red-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <i className="fas fa-undo-alt w-6-ml-2" />
                      <span className="ml-3 text-center">Reset</span>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
          {/* RESULT */}
          <div className="md:col-span-2">
            <div className="shadow sm:rounded-md sm:overflow-hidden">
              <div className="px-12 py-3 bg-gray-50 text-left sm:px-12">
                <div className="flex flex-col items-center">
                  <h1 className="text-4xl xl:text-6xl font-extrabold mt-16">
                    Computation Details
                  </h1>
                  <div className="w-full flex-1 text-indigo-500">
                    <div className="my-6 border-b text-center">
                      <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/4"></div>
                    </div>
                    <div className="md:grid md:grid-cols-2 md:gap-8">
                      <div className="md:col-span-1">
                        <form
                          className="mx-auto max-w-xs relative "
                          onSubmit={handleSubmit}
                        >
                          <label
                            htmlFor="generationcharge"
                            className="mt-8 block text-m font-medium text-gray-700 "
                          >
                            Generation Charge
                          </label>
                          <input
                            className="mt-2 w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-m focus:outline-none"
                            type="text"
                            id="generationcharge"
                            placeholder="PHP --.--"
                            readOnly="readonly"
                            onChange={handleChange("generationcharge")}
                            value={generationcharge}
                          />
                          <label
                            htmlFor="transmission"
                            className="mt-4 block text-m font-medium text-gray-700"
                          >
                            Transmission
                          </label>

                          <input
                            className="mt-2 w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-m focus:outline-none"
                            type="text"
                            id="transmission"
                            placeholder="PHP --.--"
                            readOnly="readonly"
                            onChange={handleChange("transmission")}
                            value={transmission}
                          />

                          <label
                            htmlFor="System Loss Charge"
                            className="mt-4 block text-m font-medium text-gray-700"
                          >
                            System Loss Charge
                          </label>

                          <input
                            className="mt-2 w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-m focus:outline-none"
                            type="text"
                            id="systemlosscharge"
                            placeholder="PHP --.--"
                            readOnly="readonly"
                            onChange={handleChange("systemlosscharge")}
                            value={systemlosscharge}
                          />

                          <label
                            htmlFor="distributioncharge"
                            className="mt-4 block text-m font-medium text-gray-700"
                          >
                            Distribution Charge
                          </label>

                          <input
                            className="mt-2 w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-m focus:outline-none"
                            type="text"
                            id="distributioncharge"
                            placeholder="PHP --.--"
                            readOnly="readonly"
                            onChange={handleChange("distributioncharge")}
                            value={distributioncharge}
                          />
                        </form>
                      </div>
                      <div className="md:col-span-1">
                        <form
                          className="mx-auto max-w-xs relative "
                          onSubmit={handleSubmit}
                        >
                          <label
                            htmlFor="lifelinediscount"
                            className="mt-8 block text-m font-medium text-gray-700"
                          >
                            Lifeline Discount
                          </label>

                          <input
                            className="mt-2 w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-m focus:outline-none"
                            type="text"
                            id="lifelinediscount"
                            placeholder="PHP --.--"
                            readOnly="readonly"
                            onChange={handleChange("lifelinediscount")}
                            value={lifelinediscount}
                          />

                          <label
                            htmlFor="valueaddedtax"
                            className="mt-4 block text-m font-medium text-gray-700"
                          >
                            Value Added Tax
                          </label>

                          <input
                            className="mt-2 w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-m focus:outline-none"
                            type="text"
                            id="valueaddedtax"
                            placeholder="PHP --.--"
                            readOnly="readonly"
                            onChange={handleChange("valueaddedtax")}
                            value={valueaddedtax}
                          />

                          <label
                            htmlFor="universalcharge"
                            className="mt-4 block text-m font-medium text-gray-700"
                          >
                            Universal Charge
                          </label>

                          <input
                            className="mt-2 w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-m focus:outline-none"
                            type="text"
                            id="universalcharge"
                            placeholder="PHP --.--"
                            readOnly="readonly"
                            onChange={handleChange("universalcharge")}
                            value={universalcharge}
                          />

                          <label
                            htmlFor="fitall"
                            className="mt-4 block text-m font-medium text-gray-700"
                          >
                            Fit All
                          </label>

                          <input
                            className="mt-2 w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-m focus:outline-none"
                            type="text"
                            id="fitall"
                            placeholder="PHP --.--"
                            readOnly="readonly"
                            onChange={handleChange("fitall")}
                            value={fitall}
                          />
                          <label
                            htmlFor="price2"
                            className="mt-4 block text-m font-medium text-gray-700"
                          >
                            Estimated Total Price
                          </label>
                          <input
                            className="mt-2 mb-10 w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-m focus:outline-none"
                            type="text"
                            id="price2"
                            placeholder="PHP --.--"
                            readOnly="readonly"
                            onChange={handleChange("price")}
                            value={price}
                          />
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden sm:block" aria-hidden="true">
        <div className="py-5">
          <div className="border-t border-gray-200" />
        </div>
      </div>
    </>
  );
};
export default Home;
