import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:holefeeder/core/providers/data_provider.dart';
import 'package:holefeeder/ui/shared/view_model_provider.dart';
import 'package:holefeeder/ui/shared/widgets.dart';
import 'package:provider/provider.dart';
import 'package:universal_platform/universal_platform.dart';

import 'package:holefeeder/core/models/category.dart';
import 'package:holefeeder/core/view_models/screens/categories_view_model.dart';

class CategoriesScreen extends StatefulWidget {
  const CategoriesScreen({super.key});

  @override
  State<CategoriesScreen> createState() => _CategoriesScreenState();
}

class _CategoriesScreenState extends State<CategoriesScreen> {
  @override
  Widget build(BuildContext context) =>
      UniversalPlatform.isApple
          ? _buildForCupertino(context)
          : _buildForMaterial(context);

  Widget _buildForCupertino(BuildContext context) => CupertinoPageScaffold(
    navigationBar: CupertinoNavigationBar(middle: const Text('Categories')),
    child: _buildScreen(context),
  );

  Widget _buildForMaterial(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Categories')),
      body: _buildScreen(context),
    );
  }

  Widget _buildScreen(BuildContext context) =>
      ViewModelProvider<CategoriesViewModel>(
        model: CategoriesViewModel(dataProvider: context.read<DataProvider>()),
        builder: (CategoriesViewModel model) {
          if (model.isLoading) {
            return Padding(
              padding: const EdgeInsets.all(16),
              child: Center(
                child: Column(
                  children: <Widget>[
                    Text('Loading your wishlist'),
                    SizedBox(height: 32),
                    HolefeederWidgets.activityIndicator(),
                  ],
                ),
              ),
            );
          }

          if (model.hasError) {
            return Padding(
              padding: const EdgeInsets.all(16),
              child: Center(
                child: Column(
                  children: <Widget>[
                    const Text('Oops we had trouble loading your wishlist'),
                    const SizedBox(height: 32),
                    HolefeederWidgets.button(
                      onPressed: () async {
                        await model.refreshCategories();
                      },
                      child: const Text('Retry'),
                    ),
                  ],
                ),
              ),
            );
          }

          final items = model.categories;
          if (items.isEmpty) {
            return const Center(
              child: Text('Your wishlist is empty. Why not add some items'),
            );
          }

          return ListView.builder(
            itemCount: items.length,
            itemBuilder: (_, int index) => _buildRow(items[index]),
          );
        },
      );

  Widget _buildRow(Category item) {
    return UniversalPlatform.isApple
        ? CupertinoListTile(
          title: Text(item.name),
          subtitle: Text(item.color),
          trailing: IconButton(
            onPressed: () async {},
            icon: Icon(HolefeederWidgets.iconEdit),
          ),
        )
        : Card(
          child: Padding(
            padding: const EdgeInsets.all(8),
            child: Row(
              children: <Widget>[
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: <Widget>[Text(item.name), Text(item.color)],
                  ),
                ),
                IconButton(
                  onPressed: () async {},
                  icon: Icon(HolefeederWidgets.iconEdit),
                ),
                IconButton(
                  onPressed: () async {},
                  icon: Icon(HolefeederWidgets.iconDelete),
                ),
              ],
            ),
          ),
        );
  }
}
