import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:holefeeder/core.dart';
import 'package:holefeeder/core/core_providers.dart';
import 'package:holefeeder/l10n.dart';
import 'package:holefeeder/presentation.dart';
import 'package:holefeeder/presentation/widgets/platform/platform_widget.dart';
import 'package:provider/provider.dart';

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
  }

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ...eventProviders,
        ...authenticationProviders,
        ...networkProviders,
        ...serviceProviders,
        ...repositoryProviders,
        ...viewModelProviders,
      ],
      child: Builder(builder: _buildApp),
    );
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

  Widget _buildApp(BuildContext context) {
    var quickActionsService = context.read<QuickActionsService>();
    quickActionsService.initialize(router);

    SystemChrome.setPreferredOrientations([DeviceOrientation.portraitUp]);

    return NotificationServiceScope(
      child: PlatformWidget(
        cupertinoBuilder: _buildCupertinoApp,
        materialBuilder: _buildMaterialApp,
      ),
    );
  }

  Widget _buildCupertinoApp(BuildContext context) => CupertinoApp.router(
    onGenerateTitle: (context) => AppLocalizations.of(context).holefeederTitle,
    theme: buildCupertinoThemeData(context),
    routerConfig: router,
    localizationsDelegates: _localizationsDelegates,
    supportedLocales: _supportedLocales,
    locale: _locale,
    builder: _initializeApp,
  );

  Widget _buildMaterialApp(BuildContext context) => MaterialApp.router(
    onGenerateTitle: (context) => AppLocalizations.of(context).holefeederTitle,
    theme: buildLightMaterialThemeData(),
    darkTheme: buildDarkMaterialThemeData(),
    themeMode: ThemeMode.system,
    routerConfig: router,
    localizationsDelegates: _localizationsDelegates,
    supportedLocales: _supportedLocales,
    locale: _locale,
    builder: _initializeApp,
  );

  Widget _initializeApp(BuildContext context, Widget? child) {
    L10nService.initialize(context);
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
  }
}
