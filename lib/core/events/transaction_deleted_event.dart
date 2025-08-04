import 'event_payload.dart';

class TransactionDeletedEvent extends EventPayload {
  final String accountId;

  @override
  final name = 'transactionDeletedEvent';

  TransactionDeletedEvent(this.accountId);
}
