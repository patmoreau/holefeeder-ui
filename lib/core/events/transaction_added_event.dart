import 'event_payload.dart';

class TransactionAddedEvent extends EventPayload {
  final String accountId;

  @override
  final name = 'cashflowChangedEvent';

  TransactionAddedEvent(this.accountId);
}
