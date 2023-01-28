//import "antd/dist/antd.css";
import "../Styles/Table.css";
import { Button, Table, Modal, Input } from "antd";
import { useState, useEffect } from "react";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { putData, postData, deleteData, getData } from "../utils/fetchData.js";

//pentru informare
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function Images() {
  const [refresh, setRefresh] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const [dataSource, setDataSource] = useState([]);
  const columns = [
    {
      key: "1",
      title: "Image Id",
      dataIndex: "ImageId",
    },
    {
      key: "2",
      title: "Name",
      dataIndex: "Name",
    },
    {
      key: "3",
      title: "Path",
      dataIndex: "Path",
    },
    {
      key: "4",
      title: "Dimensions",
      dataIndex: "Dimensions",
    },
    {
      key: "5",
      title: "Deleted",
      dataIndex: "Deleted",
      render: (text) => String(text),
    },
    {
      key: "6",
      title: "User Id",
      dataIndex: "UserId",
      render: (text) => String(text),
    },
    {
      key: "8",
      title: "Preview",
      render:  (record) => <img style = {{maxHeight: "100px", maxWidth:"100px"}} src={`${record.Path}`} alt="Image not found" />,
    },
    {
      key: "9",
      title: "Actions",
      render: (record) => {
        return (
          <>
            <EditOutlined
              onClick={() => {
                onEditImage(record);
              }}
            />
            <DeleteOutlined
              onClick={() => {
                onDeleteImage(record);
              }}
              style={{ color: "red", marginLeft: 12 }}
            />
          </>
        );
      },
    },
  ];

  /**gets all images */
  useEffect(() => {
    getData(`/api/Image`).then((json) => {
      let array = [];
      json.forEach((element) => {
        console.log(element);
        //array_path.push(element.Path);
        array.push(element);
      });
      setDataSource(array);
      console.log(array);
    });
  }, [refresh]);

  /**insert new image */
  const onAddImage = async () => {
    const randomNumber = parseInt(Math.random() * 1000);
    const newImage = {
      ImageId: Math.floor(Math.random() * 10000) + "_" + Date.now(),
      Name: "",
      Path: "",
      Dimensions: "",
      Deleted: true,
      UserId: null,
    };
    
    postData("/api/Image", newImage).then((data) => {
      if(data.status !== 200){
        toast("Error on creating image!");
      }
      else{
        toast("Image created!");
      }
      setRefresh(!refresh);
    });
  };

  // delete image
  const onDeleteImage = (record) => {
    Modal.confirm({
      title: "Are you sure, you want to delete this image record?",
      okText: "Yes",
      okType: "danger",
      onOk: () => {
        deleteData(`/api/Image/${record.ImageId}`).then(
          (data) => {
            if(data.status !== 200){
              toast("Error on deleting image!");
            }
            else{
              toast("Image deleted!");
            }
            setRefresh(!refresh);
          }
        );
      },
    });
  };

  const onEditImage = (record) => {
    setIsEditing(true);
    setEditingImage({ ...record });
  };
  const resetEditing = () => {
    setIsEditing(false);
    setEditingImage(null);
  };
  return (
    <div className="PricingEffect">
      <ToastContainer />
      <header className="PricingEffect-header">
        <Button onClick={async () => 
          await onAddImage()}
          >Add a new Image</Button>
        <Table columns={columns} dataSource={dataSource}></Table>
        <Modal
          title="Edit Image"
          visible={isEditing}
          okText="Save"
          onCancel={() => {
            resetEditing();
          }}
          onOk={() => {
            let json_put = {
              ...editingImage,
              UserId: editingImage.UserId,
              User: { UserId: editingImage.UserId },
            };
            putData(
              `/api/Image/${editingImage.ImageId}`,
              json_put
            ).then((data) => {
              if(data.status !== 200){
                toast("Error on editing image!");
              }
              else{
                toast("Image edited!");
                setRefresh(!refresh);
              }
            });
            resetEditing();
          }}
        >
          <Input
            value={editingImage?.ImageId}
          />
          <Input
            value={editingImage?.Name}
            onChange={(e) => {
              setEditingImage((pre) => {
                return { ...pre, Name: e.target.value };
              });
            }}
          />
          <Input
            value={editingImage?.Path}
            onChange={(e) => {
              setEditingImage((pre) => {
                return { ...pre, Path: e.target.value };
              });
            }}
          />
          <Input
            value={editingImage?.Dimensions}
            onChange={(e) => {
              setEditingImage((pre) => {
                return { ...pre, Dimensions: e.target.value };
              });
            }}
          />
          <select
            style={{
              textAlign: "center",
              borderRadius: "8px",
              borderColor: "hsl(204, 100%, 56%)",
              width: "100%",
            }}
            value={editingImage?.Deleted}
            onChange={(e) => {
              setEditingImage((pre) => {
                return { ...pre, Deleted: e.target.value };
              });
            }}
          >
            <option>true</option>
            <option>false</option>
          </select>

          <select
            style={{
              textAlign: "center",
              borderRadius: "8px",
              borderColor: "hsl(204, 100%, 56%)",
              width: "100%",
            }}
            value={ editingImage?.UserId}
            onChange={(e) => {
              setEditingImage((pre) => {
                return { ...pre, UserId: e.target.value };
              });
            }}
          >
            {dataSource[0] !== undefined
              ? dataSource[0].Users_list.map((usersId, index) => {
                  return usersId ? (
                    <option key={index}> {usersId}</option>
                  ) : (
                    <></>
                  );
                })
              : null}
          </select>
        </Modal>
      </header>
    </div>
  );
}
