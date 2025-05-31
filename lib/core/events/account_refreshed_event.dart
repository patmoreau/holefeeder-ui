import 'package:holefeeder/core/models/account.dart';

import 'event_payload.dart';

class AccountRefreshedEvent extends EventPayload {
  final String accountId;
  final Account account;

  AccountRefreshedEvent(this.accountId, this.account)
    : super('accountRefreshedEvent');
}
