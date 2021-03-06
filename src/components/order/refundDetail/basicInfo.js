// @flow
import React, { Component } from "react";
import styles from "./index.css";
import { View } from "react-web-dom";
import InfoRow from "../../public/info/infoRow";
import moment from 'moment'

type Props = {
    history: { push: Function },
    refund_sn: string,
    refund_type: number,
    handle_state: number,
    create_time: number,
    handle_message: string,
    order_id: number,
    order_sn: string,
}
type State = {}
export default class OrderDetailBasicInfo extends Component<Props, State> {
    render() {
        const { refund_sn, refund_type, handle_state, handle_message, create_time, order_id, order_sn, history } = this.props
        return (
            <View className={styles.infoWarp}>
                <p className={styles.infoTitle}>基本信息</p>
                <InfoRow
                    infoList={[
                        {
                            title: '退款编号',
                            info: refund_sn,
                        }, {
                            title: '退款方式',
                            info: this.returnRefundType(refund_type),
                        }, {
                            title: '退款状态',
                            info: this.returnRefundState(handle_state),
                            infoColor: '#FA445F',
                        },
                        {
                            title: '申请时间',
                            info: moment(create_time, 'X').format('YYYY-MM-DD HH:mm:ss'),
                        },
                        {
                            title: '订单编号',
                            info: <a
                                onClick={() => {
                                    history.push(`/order/list/detail?id=${order_id}`)
                                }}
                            >
                                {order_sn}
                            </a>,
                            infoColor: '#FA445F',
                        },
                    ]}
                />
            </View>
        );
    }

    returnRefundType(type: number) {
        switch (type) {
            case 1:
                return '仅退款'
            case 2:
                return '退货退款'
            default:
                return '-'

        }
    }

    returnRefundState(state: number) {
        switch (state) {
            case 0:
                return '未处理'
            case 10:
                return '已拒绝退款'
            case 20:
                return '已同意退款'
            case 30:
                return '已完成'
            case 50:
                return '用户主动撤销'
            case 51:
                return '用户主动收货'
            default:
                return '-'

        }
    }
}
