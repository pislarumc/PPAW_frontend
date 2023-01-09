import React, { useState, useEffect, useRef } from "react";
import "../Styles/Home.css";
import Slider from "../Components/Slider";
import SidebarItem from "../Components/SlidebarItem";
import { Button, Table, Modal, Input } from "antd";

import * as htmlToImage from 'html-to-image';

const DEFAULT_OPTIONS = [
  {
    name: "None",
    property: "",
    value: 0,
    range: {
      min: 0,
      max: 200,
    },
    unit: "%",
  },
];

export default function Home() {
  const [isShowing, setIsShowing] = useState(false);
  const [images, setImages] = useState([]);
  const [selectImage, setSelectImage] = useState();
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(0);
  const [options, setOptions] = useState(DEFAULT_OPTIONS);
  const selectedOption = options[selectedOptionIndex];
  

  const myCanvas = useRef();
  const myImage = useRef();

  useEffect(() => {
    if(myCanvas.current)
    {
      let context = myCanvas.current.getContext("2d");

      const image = new Image();
      image.src = selectImage;

      context.canvas.width = image.naturalWidth;
      context.canvas.height = image.naturalHeight;

      image.onload = () => {
        if(getImageStyleAndURL())
        {
          let filter_get = getImageStyleAndURL().filter;
          //image.style = {filter: `${filter_get}`};
          image.style.filter = filter_get;
          context.canvas.style.filter = filter_get;
        }
        //context.drawImage(image, 0, 0, 200, 200);
        //context.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight, 0, 0, image.naturalWidth, image.naturalHeight)
        context.drawImage(image, 0, 0, context.canvas.width, context.canvas.height)
      };
    }
  }, [isShowing]);

  useEffect(() => {
    //fetch(`https:jlnosdfbdj/api/Image${''}`)
    fetch(`https://localhost:44313/api/Effect`)
      .then((response) => response.json())
      .then((json) => {
        let array = [];
        json.forEach((element) => {
          console.log(element);
          //array_path.push(element.Path);
          array.push(
            //element
            {
              name: element.EffectName,
              property: element.CssProperty,
              value: element.PropertyValue,
              range: {
                min: element.PropertyRangeMin,
                max: element.PropertyRangeMax,
              },
              unit: element.PropertyUnit,
              cost: element.Cost,
              deleted: element.Deleted,
            }
          );
        });
        if (options === undefined) array = [{}];
        setOptions(array);
      });
  }, []); //pentru a nu pierde setarile intre efecte si a permite folosirea mai multor efecte concomitent

  useEffect(() => {
    setSelectImage(
      "https://png.pngitem.com/pimgs/s/244-2446110_transparent-social-media-clipart-black-and-white-choose.png"
    );
  }, []);

  useEffect(() => {
    //fetch(`https:jlnosdfbdj/api/Image${''}`)
    fetch(`https://localhost:44313/api/Image`)
      .then((response) => response.json())
      .then((json) => {
        let array_path = [];
        json.forEach((element) => {
          console.log(element);
          //array_path.push(element.Path);
          array_path.push(element);
        });
        if (images === undefined) array_path = [""];
        setImages(array_path);
      });
  }, [selectImage]);

  function handleSliderChange({ target }) {
    setOptions((prevOptions) => {
      return prevOptions.map((option, index) => {
        if (index !== selectedOptionIndex) return option;
        return { ...option, value: target.value };
      });
    });
  }

  function getImageStyleAndURL() {
    //filters
    const filters = options.map((option) => {
      return option.deleted === false
        ? `${option.property}(${option.value}${option.unit})`
        : "";
    });

    //url
    const backgroundImage_local = `url(${selectImage})`;

    return {
      filter: filters.join(" "),
      backgroundImage: backgroundImage_local,
    };
  }

  //console.log(getImageStyle())

  const downloadImage = async () => {
    const dataUrl = await htmlToImage.toPng(myImage.current);

    // download image
    const link = document.createElement('a');
    link.download = 'html-to-img.png';
    link.href = dataUrl;
    link.click();
  };

  return (
    <div className="container-home">
      <Modal
        centered={true}
        title="Download Image"
        visible={isShowing}
        okText="Download"
        cancelText="Back"
        bodyStyle={{  display:"flex", flexDirection:"column", alignItems:"center", height:"70vh"}}
        width={"90vw"}
        onCancel={() => {
          setIsShowing(false);
        }}
        onOk={() => {
          setIsShowing(false);
          downloadImage();
        }}
      >
        <canvas style={{backgroundColor:"gray", maxWidth: "100%", maxHeight: "100%"}} className="canvas" ref={myCanvas} />
      </Modal>
      <div ref={myImage} id="Imagine_finala" className="main-image" style={getImageStyleAndURL()} />

      <div className="sidebar">
        {options.map((option, index) => {
          return option.deleted === false ? (
            <SidebarItem
              key={index}
              name={option.name}
              active={index === selectedOptionIndex}
              handleClick={() => setSelectedOptionIndex(index)}
            />
          ) : null;
        })}
      </div>
      <Slider
        min={selectedOption.range.min}
        max={selectedOption.range.max}
        value={selectedOption.value}
        handleChange={handleSliderChange}
      />

      <select
        className="slider"
        style={{
          textAlign: "center",
          borderRadius: "8px",
          borderColor: "hsl(204, 100%, 56%)",
          maxWidth: "100%",
        }}
        value={selectImage}
        onChange={(e) => setSelectImage(e.target.value)}
      >
        <option>
          {
            "https://png.pngitem.com/pimgs/s/244-2446110_transparent-social-media-clipart-black-and-white-choose.png"
          }
        </option>
        {images.length > 0
          ? images.map((img, index) => {
              return img.Deleted === false ? (
                <option key={index}> {img.Path}</option>
              ) : (
                <></>
              );
            })
          : null}
      </select>
      <Button
        onClick={() => {
          setIsShowing(true);
        }}
      >
        Show
      </Button>
    </div>
  );
}
