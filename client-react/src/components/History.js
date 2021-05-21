import axios from "axios";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Card,
  CardContent,
  Typography,
  makeStyles,
  Grid,
} from "@material-ui/core";
import NavBar from "./Navbar";
import Cookies from "js-cookie";

const useStyles = makeStyles({
  root: {
    minWidth: 375,
    flexGrow: 1,
    padding: 12,
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  cover: {
    width: 151,
  },
  details: {
    display: "flex",
    flexDirection: "column",
  },
  BiD: {
    marginLeft: 18,
  },
});

export default function History({ history }) {
  const token = Cookies.get("token");
  
  const classes = useStyles();
  const [formData, setFormData] = useState([]);

  const loadHistory = () => {
    axios.get("http://127.0.0.1:5000/history").then((result) => {
      setFormData(result.data);
    });
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const removeSomeHist = (e) => {
    const name = e.target.getAttribute("id");
    axios.delete(`http://127.0.0.1:5000/delete/${name}`).then((res) => {
      toast.info(res.data.status);
      loadHistory();
    });
  };

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center overflow-hidden">
        {token && token != " " && token != undefined
          ? null
          : history.push(
              "/login",
              toast.warn("OOPS!, Session Expired! Sign in Required")
            )}
        <div className="sm:m-20 sm:rounded-lg flex justify-center flex-1">
          <div className="sm:rounded-md sm:overflow-hidden ">
            <div className="flex flex-col items-center">
              <h1 className="text-4xl xl:text-6xl font-extrabold mt-6">
                {formData == "" ? "No Record Found" : "Computation History"}
              </h1>
              <div className="w-full flex-1">
                <div className="my-6 border-b text-center">
                  <div className="leading-none inline-block tracking-wide font-medium bg-white transform translate-y-1/4"></div>
                </div>
              </div>

              <Grid container direction="column-reverse" justify="flex-end">
                {formData.map((computhist) => (
                  <Card className={classes.root} variant="outlined" key={computhist._id}>
                    <div className={classes.details}>
                      <CardContent>
                        <Typography variant="h5" component="h2">
                          {"DATE COMPUTED: " + computhist.computed_at}
                        </Typography>

                        <Grid container spacing={9}>
                          <Grid item xs={4}>
                            <label className="mt-3 block text-m font-medium text-gray-700 ">
                              Estimated Total Price
                            </label>
                            <input
                              className="mt-2 px-4 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-m focus:outline-none"
                              type="text"
                              readOnly="readonly"
                              value={computhist.estimated_price}
                            />
                          </Grid>
                          <Grid item xs={4}>
                            <label className="mt-3 block text-m font-medium text-gray-700 ">
                              Power Consumed
                            </label>
                            <input
                              className="mt-2  px-4 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-m focus:outline-none"
                              type="text"
                              readOnly="readonly"
                              value={computhist.kWh + " kilowatt-hour"}
                            />
                          </Grid>

                          <Grid item xs={4}>
                            <button
                              id={computhist._id}
                              onClick={removeSomeHist}
                              className="mt-11 mb-2 tracking-wide font-semibold bg-red-500 text-white w-full py-4 rounded-lg hover:bg-red-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                              <i className="fas fa-trash w-6-ml-2" />
                              <span className="ml-3 text-center">Remove</span>
                            </button>
                          </Grid>
                        </Grid>
                      </CardContent>
                      <Typography
                        variant="body2"
                        component="p"
                        className={classes.BiD}
                      >
                        Bill ID:
                        {computhist._id}
                      </Typography>
                    </div>
                  </Card>
                ))}
              </Grid>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
