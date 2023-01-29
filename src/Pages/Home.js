import React, { useState, useEffect, useRef, useCallback } from "react";
import "../Styles/Home.css";
import Slider from "../Components/Slider";
import SidebarItem from "../Components/SlidebarItem";
import { Button, Table, Modal, Input } from "antd";

import { ToastContainer, toast } from 'react-toastify';
import * as htmlToImage from 'html-to-image';

import  { putData, postData, deleteData, getData } from "../utils/fetchData.js"

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

  /**called when the download modal is triggered to create the image on canvas */
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
    // fetch(`https://localhost:44313/api/Effect`)
    getData(`/api/Effect`)
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
        if(array.length!==0)
        {
          for(let i=0;i<array.length;i++)
          {
            if(array[i].deleted === false)
            {
              setSelectedOptionIndex(i);
              i= array.length;
            }
          }
        }
      });
  }, []); //pentru a nu pierde setarile intre efecte si a permite folosirea mai multor efecte concomitent

  /**default image just for start */
  useEffect(() => {
    setSelectImage(
      "https://png.pngitem.com/pimgs/s/244-2446110_transparent-social-media-clipart-black-and-white-choose.png"
    );
  }, []);

  // get all images again
  useEffect(() => {
      //------------------------------------------------------------
      getData(`/api/Image`)
      .then((json) => {
        let array_path = [];
        json.forEach((element) => {
          console.log(element);
          //array_path.push(element.Path);
          array_path.push(element);
        });
        if (images === undefined) array_path = [""];
        setImages(array_path);
        if(array_path.length!==0)
        {
          for(let i=0;i<array_path.length;i++)
          {
            if(array_path[i].deleted === false)
            {
              setSelectImage(array_path[i].Path);
              i= array_path.length;
            }
          }
        }
      });
      //------------------------------------------------------------
  }, [selectImage]);

  /**
   * slider control used to change a state
   * @param {*} param0 
   */
  function handleSliderChange({ target }) {
    setOptions((prevOptions) => {
      return prevOptions.map((option, index) => {
        if (index !== selectedOptionIndex) return option;
        return { ...option, value: target.value };
      });
    });
  }

  /**
   * used to dinamicly change url and css filters of an image
   * @returns { filter: css_image_filter, backgroundImage: image_url}
   */
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

  // -------------------------------------------------------------------------------------------------
  /**
   * takes an HTML tag and converts it into an image, to be able to download it
   */
  const downloadImage = useCallback(() => {
    if (myImage.current === null) {
      return
    }
    htmlToImage.toPng(myImage.current, { cacheBust: true, })
      .then((dataUrl) => {
        const link = document.createElement('a')
        link.download = 'Edited_photo.png'
        link.href = dataUrl
        link.click()
        toast("Image downloaded!");
      })
      .catch((err) => {
        toast("Error on downloading image!");
        console.log(err)
      })
  }, [myImage, isShowing])// dependency = modal command state and image reference
  // -------------------------------------------------------------------------------------------------

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
          borderColor: "gray",
          maxWidth: "100%",
          color: "white", 
          backgroundColor: "black"
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
        type="primary"
      >
        Show
      </Button>
      <ToastContainer />
    </div>
  );
}
