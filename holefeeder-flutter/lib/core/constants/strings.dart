import 'package:flutter_dotenv/flutter_dotenv.dart';

final String kServerUrl = dotenv.env['API_SERVER_URL'] ?? '';
final String kAuth0Domain = dotenv.env['AUTH0_DOMAIN'] ?? '';
final String kAuth0ClientId = dotenv.env['AUTH0_CLIENT_ID'] ?? '';
final String kAuth0Audience = dotenv.env['AUTH0_AUDIENCE'] ?? '';
final String kAuth0RedirectUriWeb = dotenv.env['REDIRECT_URI'] ?? '';

const kAuth0Scopes = {
  'openid',
  'profile',
  'email',
  'offline_access',
  'read:user',
  'write:user',
};

const kAuth0Logo =
    'https://cdn.auth0.com/blog/hub/code-samples/hello-world/auth0-logo.svg';

const kBackTextIcon = '‹';
