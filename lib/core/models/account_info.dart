class AccountInfo {
  final String id;
  final String name;

  const AccountInfo({required this.id, required this.name});

  factory AccountInfo.fromJson(Map<String, dynamic> json) {
    return AccountInfo(id: json['id'] as String, name: json['name'] as String);
  }

  Map<String, dynamic> toJson() {
    return {'id': id, 'name': name};
  }
}
