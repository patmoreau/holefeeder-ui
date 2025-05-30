import 'event_payload.dart';

class TransactionAddedEvent extends EventPayload {
  final String accountId;

  TransactionAddedEvent(this.accountId) : super('transactionAddedEvent');
}
