import 'event_payload.dart';

class CashflowChangedEvent extends EventPayload {
  final String id;

  CashflowChangedEvent(this.id) : super('cashflowChangedEvent');
}
