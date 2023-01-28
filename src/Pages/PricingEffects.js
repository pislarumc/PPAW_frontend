//import "antd/dist/antd.css";
import "../Styles/Table.css";
import { Button, Table, Modal, Input } from "antd";
import { useState, useEffect } from "react";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { putData, postData, deleteData, getData } from "../utils/fetchData.js";
import { ToastContainer, toast } from "react-toastify";

export default function PricingEffects() {
  const [refresh, setRefresh] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingEffect, setEditingEffect] = useState(null);
  const [dataSource, setDataSource] = useState([
    /**the prototype of the needed object */
    /*{
      EffectName:'string',
      Cost:'string',
      EffectId:'string',
      Deleted:'string',
      CssProperty:'string',
      PropertyValue:'string',
      PropertyRangeMin:'string',
      PropertyRangeMax:'string',
      PropertyUnit:'string'
    }*/
  ]);
  const accepted_css_filters = [
    { cssName: "blur", unit: "px" },
    { cssName: "brightness", unit: "" },
    { cssName: "contrast", unit: "%" },
    { cssName: "grayscale", unit: "%" },
    { cssName: "hue-rotate", unit: "deg" },
    { cssName: "invert", unit: "%" },
    { cssName: "opacity", unit: "%" },
    { cssName: "saturate", unit: "%" },
    { cssName: "sepia", unit: "%" },
  ];
  const columns = [
    {
      key: "1",
      title: "Effect Name",
      dataIndex: "EffectName",
    },
    {
      key: "2",
      title: "Cost",
      dataIndex: "Cost",
    },
    {
      key: "3",
      title: "Effect Id",
      dataIndex: "EffectId",
    },
    {
      key: "4",
      title: "Deleted",
      dataIndex: "Deleted",
      render: (text) => String(text),
    },
    {
      key: "5",
      title: "Css Property",
      dataIndex: "CssProperty",
    },
    {
      key: "6",
      title: "Property Value",
      dataIndex: "PropertyValue",
    },
    {
      key: "7",
      title: "Property Range Min",
      dataIndex: "PropertyRangeMin",
    },
    {
      key: "8",
      title: "Property Range Max",
      dataIndex: "PropertyRangeMax",
    },
    {
      key: "9",
      title: "Property Unit",
      dataIndex: "PropertyUnit",
    },
    {
      key: "10",
      title: "Actions",
      render: (record) => {
        return (
          <>
            <EditOutlined
              onClick={() => {
                onEditEffect(record);
              }}
            />
            <DeleteOutlined
              onClick={() => {
                onDeleteEffect(record);
              }}
              style={{ color: "red", marginLeft: 12 }}
            />
          </>
        );
      },
    },
  ];

  /**gets all effects */
  useEffect(() => {
    getData(`/api/Effect`).then((json) => {
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

  /**creates new effect */
  const onAddEffect = () => {
    const newEffect = {
      EffectName: "New Effect",
      Cost: "0.0",
      EffectId: Math.floor(Math.random() * 10000) + "_" + Date.now(),
      Deleted: true,
      CssProperty: "",
      PropertyValue: "0",
      PropertyRangeMin: "0",
      PropertyRangeMax: "20",
      PropertyUnit: "",
    };
    postData("/api/Effect", newEffect).then((data) => {
      if (data.status !== 200) {
        toast("Error on creating effect!");
      } else {
        toast("Effect created!");
      }
      setRefresh(!refresh);
    });
  };

  /**delete effect */
  const onDeleteEffect = (record) => {
    Modal.confirm({
      title: "Are you sure, you want to delete this effect record?",
      okText: "Yes",
      okType: "danger",
      onOk: () => {
        deleteData(`/api/Effect/${record.EffectId}`).then((data) => {
          if (data.status !== 200) {
            toast("Error on deleting effect!");
          } else {
            toast("Efefct deleted!");
          }
          setRefresh(!refresh);
        });
      },
    });
  };

  const onEditEffect = (record) => {
    setIsEditing(true);
    setEditingEffect({ ...record });
  };
  const resetEditing = () => {
    setIsEditing(false);
    setEditingEffect(null);
  };
  return (
    <div className="PricingEffect">
      <ToastContainer />
      <header className="PricingEffect-header">
        <Button onClick={onAddEffect}>Add a new Effect</Button>
        <Table columns={columns} dataSource={dataSource}></Table>
        <Modal
          title="Edit Effect"
          visible={isEditing}
          okText="Save"
          onCancel={() => {
            resetEditing();
          }}
          onOk={() => {
            putData(
              `/api/Effect/${editingEffect.EffectId}`,
              editingEffect
            ).then((data) => {
              if (data.status !== 200) {
                toast("Error on editing effect!");
              } else {
                toast("Effect edited!");
                setRefresh(!refresh);
              }
            });
            resetEditing();
          }}
        >
          <Input
            value={editingEffect?.EffectName}
            onChange={(e) => {
              setEditingEffect((pre) => {
                return { ...pre, EffectName: e.target.value };
              });
            }}
          />
          <Input
            value={editingEffect?.Cost}
            onChange={(e) => {
              setEditingEffect((pre) => {
                return { ...pre, Cost: e.target.value };
              });
            }}
          />
          <Input value={editingEffect?.EffectId} />
          <select
            style={{
              textAlign: "center",
              borderRadius: "8px",
              borderColor: "hsl(204, 100%, 56%)",
              width: "100%",
            }}
            value={editingEffect?.Deleted}
            onChange={(e) => {
              setEditingEffect((pre) => {
                return { ...pre, Deleted: e.target.value };
              });
            }}
          >
            <option>true</option>
            <option>false</option>
          </select>

          <Input
            value={editingEffect?.CssProperty}
            onChange={(e) => {
              setEditingEffect((pre) => {
                return { ...pre, CssProperty: e.target.value };
              });
            }}
          />
          {/* -------------------------------------------------------------------------- */}
          <select
            style={{
              textAlign: "center",
              borderRadius: "8px",
              borderColor: "hsl(204, 100%, 56%)",
              width: "100%",
            }}
            value={editingEffect?.CssProperty}
            onChange={(e) => {
              setEditingEffect((pre) => {
                const unit_required = accepted_css_filters.find(filter => filter.cssName === e.target.value).unit;
                return { ...pre, CssProperty: e.target.value, PropertyUnit: unit_required };
              });
            }}
          >
            {accepted_css_filters.map((filter, index) => {
              return filter ? (
                <option key={index}> {filter.cssName}</option>
              ) : (
                <></>
              );
            })}
          </select>
          {/* -------------------------------------------------------------------------- */}
          <Input
            value={editingEffect?.PropertyValue}
            onChange={(e) => {
              setEditingEffect((pre) => {
                return { ...pre, PropertyValue: e.target.value };
              });
            }}
          />
          <Input
            value={editingEffect?.PropertyRangeMin}
            onChange={(e) => {
              setEditingEffect((pre) => {
                return { ...pre, PropertyRangeMin: e.target.value };
              });
            }}
          />
          <Input
            value={editingEffect?.PropertyRangeMax}
            onChange={(e) => {
              setEditingEffect((pre) => {
                return { ...pre, PropertyRangeMax: e.target.value };
              });
            }}
          />
          <Input
            value={editingEffect?.PropertyUnit}
          />
        </Modal>
      </header>
    </div>
  );
}
