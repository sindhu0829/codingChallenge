import React from "react";
import axios from "axios";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel"; //Third party lib called react-responsive carousel is used.

import "./App.css";
import * as input from "./input.json"; //step-1: read the data from the url and stored it in a json and referenced that
import download from "./download.png";

class App extends React.Component {
  state = {
    data: input.default.groups.map((record) => {
      return {
        ...record,
        //step-3: once data is resolved, I have stored in a state variable and used a flag called 'isCarouselFlagClicked', set to false
        isCarouselFlagClicked: false,
      };
    }),
  };

  //step-2: as an alternative to step-1, I have relied on axios for making an API call and fetching the data, but we ended up getting CORS issues.
  componentDidMount() {
    axios
      .get(
        "https://www.westelm.com/services/catalog/v4/category/shop/new/all-new/index.json"
      )
      .then((res) => {
        console.log("res", res);
        //step-3: once data is resolved, I have stored in a state variable and used a flag called 'isCarouselFlagClicked', set to false
        this.setState({
          data: res.data.groups.map((record) => {
            return {
              ...record,
              isCarouselFlagClicked: false,
            };
          }),
          selectedRecord: null,
        });
      });
  }

  toggleCarouselFlag(event, record) {
    //if the  object in the list matches to the selected record, toggling the flag back and updating the state is done.
    const updatedData = this.state.data.map((selectedRec) => {
      if (selectedRec.id === record.id) {
        return {
          ...selectedRec,
          isCarouselFlagClicked: !record.isCarouselFlagClicked,
        };
      }

      return selectedRec;
    });

    this.setState({
      data: updatedData,
    });
  }

  renderProductDetailsPage() {
    //if data is not present, render nothing.
    if (!this.state.data) {
      return null;
    }

    return (
      <div
        style={{
          display: "flex",
          flexGrow: "auto",
          width: "1000px",
          flexWrap: "wrap",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2 style={{ textAlign: "center" }}> Available Items </h2>

        {this.state.data.map((record, key) => {
          return (
            <div
              key={key}
              style={{
                display: "flex",
                justifyContent: "space-evenly",
                width: "inherit",
                margin: "25px",
              }}
            >
              {
                <div style={{ width: "370px" }}>
                  {
                    //if carouselflag is not true, render the given hero image
                    !record.isCarouselFlagClicked ? (
                      record.hero ? (
                        <img
                          onClick={(e) => this.toggleCarouselFlag(e, record)}
                          src={record.hero.href}
                          width={record.hero.width}
                          height={record.hero.height}
                          alt={record.hero.alt}
                        />
                      ) : (
                        // if the hero image is not available, we render a not available custom image/
                        <img src={download} width="363" height="363" alt="" />
                      )
                    ) : null
                  }
                  {
                    // if the flag is clicked, render the carousel
                    record.isCarouselFlagClicked && (
                      <Carousel>
                        <div>
                          <img
                            src={record.thumbnail.href}
                            width={record.thumbnail.width}
                            height={record.thumbnail.height}
                            alt={record.thumbnail.alt}
                          />
                        </div>
                        <div>
                          <img
                            src={record.thumbnail.href}
                            width={record.thumbnail.width}
                            height={record.thumbnail.height}
                            alt={record.thumbnail.alt}
                          />
                        </div>
                        <div>
                          <img
                            src={record.thumbnail.href}
                            width={record.thumbnail.width}
                            height={record.thumbnail.height}
                            alt={record.thumbnail.alt}
                          />
                        </div>
                      </Carousel>
                      // in the question, It is mentioned about using thumbnail images, it looks like we only have one image. For better look and feel , we have replicated that image 3 times. Please confirm if this is correct.
                    )
                  }
                </div>
              }
              {/* displaying details of the product that include price and its range */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
              >
                <h4
                  style={{
                    fontFamily: "GT-Eesti 3r,Arial,sans-serif",
                    fontSize: "17.7px",
                    margin: "0 0 5px",
                    lineHeight: "28px",
                  }}
                >
                  {record.name}
                </h4>
                <div>{` Regular Price:  ${
                  record.price
                    ? record.price.regular
                    : "price not listed, please check with the store"
                }`}</div>
                <div style={{ color: "#af1a31" }}>
                  {" "}
                  {`Price Range:  ${
                    (record.priceRange && record.priceRange.selling.high) ||
                    "Not Available"
                  } - ${
                    (record.priceRange && record.priceRange.selling.low) ||
                    "Not Available"
                  }`}{" "}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  render() {
    return <div>{this.renderProductDetailsPage()}</div>;
  }
}

export default App;
