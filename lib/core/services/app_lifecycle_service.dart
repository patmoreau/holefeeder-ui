import 'dart:async';

import 'package:flutter/widgets.dart';
import 'package:holefeeder/core/repositories/repositories.dart';

class AppLifecycleService with WidgetsBindingObserver {
  final RepositoryFactory _repositoryFactory;
  bool _isShuttingDown = false;

  AppLifecycleService(this._repositoryFactory) {
    WidgetsBinding.instance.addObserver(this);
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.detached) {
      _handleAppShutdown();
    }
  }

  Future<void> _handleAppShutdown() async {
    if (_isShuttingDown) return;
    _isShuttingDown = true;

    await _repositoryFactory.dispose();
  }

  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    _handleAppShutdown();
  }
}
