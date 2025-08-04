import 'package:go_router/go_router.dart';

abstract class QuickActionsService {
  void initialize(GoRouter router);

  Future<void> handlePendingAction();
}
