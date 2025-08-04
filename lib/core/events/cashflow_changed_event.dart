import 'event_payload.dart';

class CashflowChangedEvent extends EventPayload {
  final String id;

  @override
  final name = 'cashflowChangedEvent';

  CashflowChangedEvent(this.id);
}
