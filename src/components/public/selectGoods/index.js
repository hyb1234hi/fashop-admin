//@flow
import React, { Component } from "react";
import { View } from "react-web-dom";
import { Modal, Input, Checkbox, Pagination, Spin,Button } from "antd";
import styles from "./index.css";
import { getGoodsList } from "../../../actions/goods";
import { connect } from "react-redux";
import { ScrollView } from "react-web-dom";
import Image from '../../image'

const Search = Input.Search;
type GoodsRowType = { id: number, title: string, price: string, img: { url: string } }
type Props = {
    dispatch?: Function,
    loading?: boolean,
    listData?: {
        page: number,
        rows: number,
        total_number: number,
        list: Array<GoodsRowType>,
    },
    multiSelect: boolean,
    visible: boolean,
    close: Function,
    onOk: Function,
}
type State = {
    url: string,
    checkedValues: Array<any>,
    checkedData: Array<GoodsRowType>
}
@connect(({
              view: {
                  goods: {
                      loading,
                      listData,
                  }
              }
          }) => ({
    loading,
    listData,
}))
export default class SelectGoods extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            multiSelect: props.multiSelect ? props.multiSelect : false,
            url: '',
            checkedData: [],
            checkedValues: []
        }
    }

    componentDidMount() {
        const { dispatch } = this.props
        if (dispatch) {
            dispatch(getGoodsList({ params: { page: 1, rows: 10 } }))
        }
    }

    render() {
        const { visible, close, onOk, multiSelect, listData, loading, dispatch } = this.props
        if (listData) {
            const { page, rows, total_number, list } = listData
            const { checkedData } = this.state
            return (
                <Modal
                    title="添加商品"
                    cancelText='取消'
                    okText='确定'
                    visible={visible}
                    style={{ top: 20 }}
                    width={756}
                    onCancel={() => {
                        close()
                    }}
                    onOk={() => {
                        onOk(checkedData)
                        this.setState({ checkedData: [] })
                    }}
                    footer={multiSelect ? <div>
                        <Button type="primary" onClick={()=>{
                            onOk(checkedData)
                            this.setState({ checkedData: [] })
                        }}>确认</Button>
                    </div> : null}
                >
                    <Spin spinning={loading}>
                        <View className={styles.goodsList}>
                            <View className={styles.goodsListTop}>
                                <Search
                                    placeholder="请输入商品名称"
                                    onSearch={(value) => {
                                        if (dispatch) {
                                            dispatch(getGoodsList({ params: { page, rows, title: value } }))
                                        }
                                    }}
                                    style={{ width: 200 }}
                                />
                            </View>
                            <ScrollView className={styles.scrollView}>
                                {
                                    list.map((item, i) => {
                                        const index = checkedData.findIndex((e) => e.id === item.id)
                                        const checked = index !== -1
                                        const onPress = () => {
                                            let _checkedData = checkedData
                                            if (checked) {
                                                _checkedData.splice(index, 1)
                                                this.setState({
                                                    checkedData: _checkedData
                                                })
                                            } else {
                                                _checkedData = multiSelect ?  [..._checkedData, item] : [item]
                                                this.setState({
                                                    checkedData: _checkedData
                                                }, () => {
                                                    !multiSelect ? onOk(this.state) : null
                                                })
                                            }
                                        }
                                        return (
                                            <View className={styles.view1} key={i}>
                                                <Checkbox
                                                    checked={checked}
                                                    onChange={(e) => {
                                                        onPress()
                                                    }}
                                                />
                                                <View
                                                    className={styles.goodsListItem}
                                                    onClick={() => {
                                                        onPress()
                                                    }}
                                                >
                                                    <View className={styles.itemLeft}>
                                                        <Image
                                                            type='goods'
                                                            src={item.img}
                                                        />
                                                        <View className={styles.itemText}>
                                                            <p>{item.title}</p>
                                                            <span>￥{item.price}</span>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                        )
                                    })
                                }
                            </ScrollView>
                            <View className={styles.paginationView}>
                                <Pagination
                                    size="small"
                                    showSizeChanger={false}
                                    showQuickJumper={false}
                                    pageSize={rows}
                                    total={total_number}
                                    current={page}
                                    onChange={(current, pageSize) => {
                                        if (dispatch) {
                                            dispatch(getGoodsList({
                                                params: {
                                                    page: current,
                                                    rows: pageSize
                                                }
                                            }))
                                        }
                                    }}
                                    onShowSizeChange={(current, pageSize) => {
                                        if (dispatch) {

                                            dispatch(getGoodsList({
                                                params: {
                                                    page: current,
                                                    rows: pageSize
                                                }
                                            }))
                                        }
                                    }}
                                />
                            </View>
                        </View>
                    </Spin>
                </Modal>
            )
        }else{
            return null
        }
    }
}
