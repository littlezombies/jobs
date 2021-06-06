import React, { useState, useEffect } from 'react';
import { Tree, Modal, Input } from 'antd';
import {
  EditOutlined,
  PlusOutlined,
  MinusOutlined,
  // CloseOutlined,
  // CheckOutlined,
} from "@ant-design/icons";
// import { PageContainer, } from '@ant-design/pro-layout';

const treeData = [
  {
    value: 'parent 1',
    key: '0-0',
    children: [
      {
        value: 'parent 1-0',
        key: '0-0-0',
        children: [
          {
            value: 'leaf',
            key: '0-0-0-0',
          },
          {
            value: 'leaf',
            key: '0-0-0-1',
          },
        ],
      },
    ],
  },
];

const transformTitle = (data) => data.map((item) => {
  if (item.children && item.children instanceof Array) {
    return {
      ...item,
      title: item.value,
      children: transformTitle(item.children)
    }
  }
  return {
    ...item,
    title: item.value,
  }
})

const ModalDemo = (props) => {
  const { visible, setVisible, editNode, titleAndKey, setTitleAndKey } = props
  const [ value, setValue ] = useState('')
  useEffect(() => {
    setValue(titleAndKey.title)
  }, [titleAndKey])
  const valueChange = e => {
    setValue(e.target.value)
  }

  const cancel = () => {
    setVisible(false)
    setTitleAndKey({ title: '', key: '' })
  } 

  const onsubmit = () => {
    // 这里注意保存修改的数据
    editNode(titleAndKey.key, value)
    setVisible(false)
    setTitleAndKey({ title: '', key: '' })
  }
  return <Modal destroyOnClose title="Basic Modal" visible={visible} onOk={() => onsubmit()} onCancel={() => cancel()}>
          <Input value={value} onChange={(e) => valueChange(e)} />
        </Modal>
}

const TreeDemo = () => {
  const [ dataSource, setDataSource ] = useState([])

  const [ titleAndKey, setTitleAndKey ] = useState({ title: '', key: ''})
  const [ visible, setVisible ] = useState(false)

  // 用来记录新增的数组
  const [ addArr, setAddArr ] = useState([])
  // 用来记录删除的数组
  const [ deleteArr, setDeleteArr ] = useState([])

  const addNodeForTree = (data, key) => data.map(item => {
    if (item.children && item.children instanceof Array) {
      return {
        ...item,
        children: item.key === key ? [
                                        ...item.children,
                                        {
                                          title: 'test',
                                          value: 'test',
                                          key: new Date().getTime(), // 这个key可以自己定
                                          isNew: true, // 这个在删除的时候判断是否删新增数组
                                        }
                                     ] 
                                   : addNodeForTree(item.children, key)
      }
    }
    if (item.key === key) {
      return {
        ...item,
        children: [
          {
            title: 'test',
            value: 'test',
            key: new Date().getTime(), // 这个key可以自己定
            isNew: true, // 这个在删除的时候判断删是否删新增数组
          }
        ]
      }
    }
    return {
      ...item,
    }
  })

  const deleteNodeForTree = (data, key) => {
    const findData = data.find(item => item.key === key)
    if (!!findData) {
      if (findData.isNew) {
        // 这里去删除记录新增的数组
      } else {
        // 这里在记录删除的数组里记录
      }
      return data.filter(item => item.key !== key)
    }
    return data.map(item => {
      if (item.children && item.children instanceof Array) {
        return {
          ...item,
          children: deleteNodeForTree(item.children, key)
        }
      }
      return {
        ...item,
      }
    })
  }

  const editNodeForTree = (data, key, text) => data.map(item => {
    if (item.children && item.children instanceof Array) {
      return {
        ...item,
        title: item.key === key ? text : item.title,
        value: item.key === key ? text : item.value,
        children: editNodeForTree(item.children, key, text)
      }
    }
    return {
      ...item,
      title: item.key === key ? text : item.title,
      value: item.key === key ? text : item.value,
    }
  })

  const addNode = (key) => {
    const newData = addNodeForTree(dataSource, key)
    setDataSource(newData)
  }

  const deleteNode = (key) => {
    const newData = deleteNodeForTree(dataSource, key)
    setDataSource(newData)
  }

  const editNode = (key, text) => {
    const newData = editNodeForTree(dataSource, key, text)
    setDataSource(newData)
  }

  const showModal = (title, key) => {
    setVisible(true)
    setTitleAndKey({ title, key })
  }

  const renderTitle = (nodeData) => <div>
          <span>{nodeData.title}</span>
          <span>
            <EditOutlined
              style={{ marginLeft: 10 }}
              onClick={() => showModal(nodeData.title, nodeData.key)}
            />

            <PlusOutlined
              style={{ marginLeft: 10 }}
              onClick={() => addNode(nodeData.key)}
            />
            <MinusOutlined
              style={{ marginLeft: 10 }}
              onClick={() => deleteNode(nodeData.key)}
            />
          </span>
        </div>


  useEffect(() => {
    // 这里要在请求完数据后去setData

    // 最好以{ title, key, children }的格式构造treeData，如果不好改后端数据，就调用这个方法转换下就行
    const data = transformTitle(treeData)

    setDataSource(data)
  }, [])

  return <div>
          <Tree
            treeData={dataSource}
            titleRender={renderTitle}
          />
          <ModalDemo
            visible={visible}
            setVisible={setVisible}
            titleAndKey={titleAndKey}
            setTitleAndKey={setTitleAndKey}
            editNode={editNode}
          />
        </div>

}

export default TreeDemo;
