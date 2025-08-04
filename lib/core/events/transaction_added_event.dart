import 'event_payload.dart';

class TransactionAddedEvent extends EventPayload {
  final String accountId;

  @override
  final name = 'transactionAddedEvent';

  TransactionAddedEvent(this.accountId);
}
