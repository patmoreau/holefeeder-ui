import 'package:holefeeder/core/constants/constants.dart';

import '../providers/hive_storage_provider.dart';

abstract class PendingActionsService {
  Future<void> setPendingAction(String action);

  Future<String?> getPendingAction();

  Future<void> clearPendingAction();

  Future<bool> hasPendingAction();
}

class PendingActionsServiceImpl implements PendingActionsService {
  final HiveStorageProvider _hiveService;

  PendingActionsServiceImpl({required HiveStorageProvider hiveService})
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
    return action != null && action.isNotEmpty;
  }
}
