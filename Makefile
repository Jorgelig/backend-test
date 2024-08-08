SEQUELIZE_CLI=npx sequelize-cli

reset-db:
	@echo "Dropping all tables..."
	$(SEQUELIZE_CLI) db:migrate:undo:all
	@echo "Database reset completed."

migrate:
	@echo "Running migrations..."
	$(SEQUELIZE_CLI) db:migrate
	@echo "Migrations completed."

seed-all:
	@echo "Seeding database..."
	$(SEQUELIZE_CLI) db:seed:all
	@echo "Seeding completed."