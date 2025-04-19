import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:holefeeder/core/constants/themes.dart';
import 'package:holefeeder/ui/services/notification_provider.dart';
import 'package:holefeeder/core/services/localization_service.dart';
import 'package:holefeeder/l10n/l10n.dart';
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

class _HolefeederAppState extends State<HolefeederApp> {
  final quickActions = const QuickActions();

  void _setupQuickActions() {
    quickActions.setShortcutItems([
      const ShortcutItem(
        type: 'action_purchase',
        localizedTitle: 'New Purchase',
        icon: 'add_chart',
      ),
    ]);
  }

  @override
  void initState() {
    super.initState();
    if (UniversalPlatform.isMobile) {
      quickActions.initialize((String shortcutType) {
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
    localizationsDelegates: const <LocalizationsDelegate<dynamic>>[
      AppLocalizations.delegate,
      GlobalMaterialLocalizations.delegate,
      GlobalWidgetsLocalizations.delegate,
      GlobalCupertinoLocalizations.delegate,
    ],
    supportedLocales: const <Locale>[Locale('en', ''), Locale('fr', '')],
    locale: const Locale('en', ''),
    builder: (context, child) {
      LocalizationService.initialize(context);
      return NotificationServiceProvider(
        child: Theme(
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
        ),
      );
    },
  );

  Widget _buildMaterialApp(BuildContext context) => MaterialApp.router(
    onGenerateTitle: (context) => AppLocalizations.of(context).holefeederTitle,
    theme: holefeederMaterialTheme.copyWith(
      extensions: <ThemeExtension<dynamic>>[
        defaultFormTheme,
        defaultErrorDialogTheme,
      ],
    ),
    routerConfig: router,
    localizationsDelegates: const <LocalizationsDelegate<dynamic>>[
      AppLocalizations.delegate,
      GlobalMaterialLocalizations.delegate,
      GlobalWidgetsLocalizations.delegate,
      GlobalCupertinoLocalizations.delegate,
    ],
    supportedLocales: const <Locale>[Locale('en', ''), Locale('fr', '')],
    locale: const Locale('en', ''),
    builder: (context, child) {
      LocalizationService.initialize(context);
      return NotificationServiceProvider(
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
      );
    },
  );
}
