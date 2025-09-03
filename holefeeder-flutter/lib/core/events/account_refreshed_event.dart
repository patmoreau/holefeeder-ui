import 'package:holefeeder/core/models.dart';

import 'event_payload.dart';

class AccountRefreshedEvent extends EventPayload {
  final String accountId;
  final Account account;

  @override
  final name = 'accountRefreshedEvent';

  AccountRefreshedEvent(this.accountId, this.account);
}
