#!/bin/bash

# === Local DB Info ===
LOCAL_HOST="127.0.0.1"
LOCAL_DB="brainco_cms"
LOCAL_USER="harris"

# === Render DB Info ===
RENDER_HOST="dpg-d40t74n5r7bs7387iikg-a.oregon-postgres.render.com"
RENDER_DB="strapi_db_l5r9"
RENDER_USER="strapi_db_l5r9_user"
RENDER_PASS="0LOhPaPb6xuQrtmtW9Ft8ut8KvxUFMOG"
RENDER_PORT="5432"

# === Dump file ===
DUMP_FILE="brainco_backup.dump"

echo "🔹 导出本地数据库..."
pg_dump -h $LOCAL_HOST -U $LOCAL_USER -d $LOCAL_DB -Fc -f $DUMP_FILE

echo "🔹 导入到 Render 数据库（忽略 owner）..."
PGPASSWORD=$RENDER_PASS pg_restore -h $RENDER_HOST -U $RENDER_USER -d $RENDER_DB -p $RENDER_PORT -c --no-owner $DUMP_FILE

echo "✅ 数据迁移完成！"