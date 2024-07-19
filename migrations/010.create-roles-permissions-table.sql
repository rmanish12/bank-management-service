CREATE TABLE IF NOT EXISTS roles_permissions (
	role_id uuid NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
	permission_id uuid NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
	PRIMARY KEY(role_id, permission_id)
);