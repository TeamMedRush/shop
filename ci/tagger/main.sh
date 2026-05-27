#!/usr/bin/env bash
set -e

git fetch origin main:main

BRANCH=$(git rev-parse --abbrev-ref HEAD)
COMMIT=$(git rev-parse HEAD)
REPO_URL=$(git config --get remote.origin.url)

IS_PR=${IS_PR:-true}
NUMBER=${NUMBER}
REPO=${REPO}

# fetch available labels
AVAILABLE_LABELS=$(gh label list --repo "$REPO" --json name -q '.[].name' | paste -sd "," -)

if [ "$IS_PR" = "true" ]; then
  INPUT_CONTENT=$(git diff main HEAD)
else
  INPUT_CONTENT=$(gh issue view "$NUMBER" --repo "$REPO" --json body -q .body)
fi

CONTENT=$(cat <<EOF
You are a label generator.

Rules:
- Output ONLY a CSV list of labels
- Choose ONLY from the provided labels
- No explanations
- No extra text

Available Labels:
$AVAILABLE_LABELS

Content:
$INPUT_CONTENT
EOF
)

AI_RESPONSE=$(curl -sS "$URL" \
  -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"content\": $(echo "$CONTENT" | jq -Rs .),
    \"repo\": \"$REPO_URL\",
    \"branch\": \"$BRANCH\",
    \"commit\": \"$COMMIT\"
  }" | jq -r '.content')

IFS=',' read -ra TAGS <<< "$AI_RESPONSE"

APPLIED_TAGS=()

for TAG in "${TAGS[@]}"; do
  CLEAN_TAG=$(echo "$TAG" | xargs)
  if [ -n "$CLEAN_TAG" ]; then
    APPLIED_TAGS+=("$CLEAN_TAG")
    if [ "$IS_PR" = "true" ]; then
      gh pr edit "$NUMBER" --repo "$REPO" --add-label "$CLEAN_TAG"
    else
      gh issue edit "$NUMBER" --repo "$REPO" --add-label "$CLEAN_TAG"
    fi
  fi
done

TAGS_STR=$(IFS=, ; echo "${APPLIED_TAGS[*]}")

if [ -n "$TAGS_STR" ]; then
  if [ "$IS_PR" = "true" ]; then
    gh pr comment "$NUMBER" --repo "$REPO" --body "🏷️ Labels added: \`$TAGS_STR\` (commit \`$COMMIT\`)"
  else
    gh issue comment "$NUMBER" --repo "$REPO" --body "🏷️ Labels added: \`$TAGS_STR\`"
  fi
fi

echo "✅ Labels applied: $TAGS_STR"
