import 'package:holefeeder/core/constants.dart';

import 'hive_service.dart';

abstract class PendingActionsService {
  Future<void> setPendingAction(String action);

  Future<String?> getPendingAction();

  Future<void> clearPendingAction();

  Future<bool> hasPendingAction();
}

class PendingActionsServiceImpl implements PendingActionsService {
  final HiveService _hiveService;

  PendingActionsServiceImpl({required HiveService hiveService})
    : _hiveService = hiveService;

  @override
  Future<void> setPendingAction(String action) => _hiveService.save(
    HiveConstants.kPendingActionsBoxName,
    HiveConstants.kPendingActionKey,
    action,
  );

  @override
  Future<String?> getPendingAction() => _hiveService.get<String>(
    HiveConstants.kPendingActionsBoxName,
    HiveConstants.kPendingActionKey,
  );

  @override
  Future<void> clearPendingAction() =>
      _hiveService.clearall(HiveConstants.kPendingActionsBoxName);

  @override
  Future<bool> hasPendingAction() async {
    final action = await getPendingAction();
    return action != null && action.trim().isNotEmpty;
  }
}
