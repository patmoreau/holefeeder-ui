import 'event_payload.dart';

class TransactionDeletedEvent extends EventPayload {
  final String accountId;

  TransactionDeletedEvent(this.accountId) : super('transactionDeletedEvent');
}
