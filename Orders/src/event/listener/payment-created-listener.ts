import {Subject, Listener, PaymentCreatedEvent, OrderStatus} from '@nghilt/common';
import {Message} from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Order } from '../../models/order';



export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
    subject: Subject.PaymentCreated = Subject.PaymentCreated;
    queueGroupName = queueGroupName;
    async onMessage(data: PaymentCreatedEvent['data'], msg:Message) {
        const order = await Order.findById(data.orderId);
        if(!order) throw new Error('Order Not Found');
        order.set({
            status: OrderStatus.Complete
        });
        await order.save();
    }
}