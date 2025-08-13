import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_web_plugins/url_strategy.dart';
import 'package:holefeeder/app.dart';

const appScheme = 'https';

Future<void> main() async {
  usePathUrlStrategy();
  await dotenv.load(
    fileName: 'assets/env/.env.${kReleaseMode ? "production" : "development"}',
  );
  WidgetsFlutterBinding.ensureInitialized();

  runApp(HolefeederApp());
}
