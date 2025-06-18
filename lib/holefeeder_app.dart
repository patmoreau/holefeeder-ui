import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:holefeeder/core/constants/themes.dart';
import 'package:holefeeder/core/services/services.dart';
import 'package:holefeeder/core/utils/utils.dart';
import 'package:holefeeder/l10n/l10n.dart';
import 'package:holefeeder/ui/services/services.dart';
import 'package:provider/provider.dart';
import 'package:quick_actions/quick_actions.dart';
import 'package:universal_platform/universal_platform.dart';

import 'main.dart';
import 'router.dart';

class HolefeederApp extends StatefulWidget {
  const HolefeederApp({super.key});

  static final GlobalKey<NavigatorState> navigatorKey =
      GlobalKey<NavigatorState>();

  @override
  State<HolefeederApp> createState() => _HolefeederAppState();
}

class _HolefeederAppState extends State<HolefeederApp>
    with WidgetsBindingObserver {
  final _quickActions = const QuickActions();
  final _localizationsDelegates = const <LocalizationsDelegate<dynamic>>[
    AppLocalizations.delegate,
    GlobalMaterialLocalizations.delegate,
    GlobalWidgetsLocalizations.delegate,
    GlobalCupertinoLocalizations.delegate,
  ];
  final _supportedLocales = const <Locale>[Locale('en'), Locale('fr')];
  final _locale = const Locale('en-CA');

  @override
  void initState() {
    super.initState();

    WidgetsBinding.instance.addObserver(this);

    if (UniversalPlatform.isMobile) {
      _quickActions.initialize((String shortcutType) {
        if (shortcutType == 'action_purchase') {
          launchedFromQuickAction = true;
          if (mounted) {
            router.push('/purchase');
          }
        }
      });
      _setupQuickActions();
    }
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    super.dispose();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    super.didChangeAppLifecycleState(state);

    if (state == AppLifecycleState.resumed) {
      final authenticationClient = Provider.of<AuthenticationClient>(
        context,
        listen: false,
      );
      authenticationClient.verifyAuthenticationStatus();
    }
  }

  void _setupQuickActions() {
    _quickActions.setShortcutItems([
      const ShortcutItem(
        type: 'action_purchase',
        localizedTitle: 'New Purchase',
        icon: 'add_chart',
      ),
    ]);
  }

  @override
  Widget build(BuildContext context) {
    SystemChrome.setPreferredOrientations([DeviceOrientation.portraitUp]);

    return NotificationServiceScope(
      child: Builder(
        builder:
            (context) =>
                UniversalPlatform.isApple
                    ? _buildCupertinoApp(context)
                    : _buildMaterialApp(context),
      ),
    );
  }

  Widget _buildCupertinoApp(BuildContext context) => CupertinoApp.router(
    onGenerateTitle: (context) => AppLocalizations.of(context).holefeederTitle,
    theme: holefeederCupertinoTheme,
    routerConfig: router,
    localizationsDelegates: _localizationsDelegates,
    supportedLocales: _supportedLocales,
    locale: _locale,
    builder: _initializeApp,
  );

  Widget _initializeApp(BuildContext context, Widget? child) {
    LocalizationService.initialize(context);
    return NotificationServiceProvider(
      child:
          UniversalPlatform.isApple
              ? Theme(
                data: ThemeData(
                  extensions: <ThemeExtension<dynamic>>[
                    defaultFormTheme,
                    defaultErrorDialogTheme,
                  ],
                ),
                child: Localizations.override(
                  context: context,
                  delegates: const [
                    AppLocalizations.delegate,
                    GlobalMaterialLocalizations.delegate,
                    GlobalWidgetsLocalizations.delegate,
                    GlobalCupertinoLocalizations.delegate,
                  ],
                  child: child ?? const SizedBox(),
                ),
              )
              : Localizations.override(
                context: context,
                delegates: const [
                  AppLocalizations.delegate,
                  GlobalMaterialLocalizations.delegate,
                  GlobalWidgetsLocalizations.delegate,
                  GlobalCupertinoLocalizations.delegate,
                ],
                child: child ?? const SizedBox(),
              ),
    );
  }

  Widget _buildMaterialApp(BuildContext context) => MaterialApp.router(
    onGenerateTitle: (context) => AppLocalizations.of(context).holefeederTitle,
    theme: holefeederMaterialTheme,
    routerConfig: router,
    localizationsDelegates: _localizationsDelegates,
    supportedLocales: _supportedLocales,
    locale: _locale,
    builder: _initializeApp,
  );
}
