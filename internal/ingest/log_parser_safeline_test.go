package ingest

import (
	"fmt"
	"testing"
	"time"

	"github.com/likaia/nginxpulse/internal/config"
)

func TestSafeLineDefaultParserParsesRayWAFLine(t *testing.T) {
	parser, err := newLogLineParser(config.WebsiteConfig{LogType: "safeline"}, nil)
	if err != nil {
		t.Fatalf("newLogLineParser(safeline) error: %v", err)
	}

	now := time.Now().In(time.FixedZone("CST", 8*3600)).Truncate(time.Second)
	line := fmt.Sprintf(
		`192.168.1.242 - - [%s] "1.111.com" "GET /csgx/api/webservice/rules?=1770383547502 HTTP/2.0" 200 36 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0" "-"`,
		now.Format(defaultNginxTimeLayout),
	)

	p := &LogParser{retentionDays: 30}
	record, err := p.parseRegexLogLine(parser, line)
	if err != nil {
		t.Fatalf("parseRegexLogLine error: %v", err)
	}

	if record.IP != "192.168.1.242" {
		t.Fatalf("unexpected ip: %q", record.IP)
	}
	if record.Method != "GET" {
		t.Fatalf("unexpected method: %q", record.Method)
	}
	if record.Url != "/csgx/api/webservice/rules?=1770383547502" {
		t.Fatalf("unexpected url: %q", record.Url)
	}
	if record.Status != 200 {
		t.Fatalf("unexpected status: %d", record.Status)
	}
	if record.BytesSent != 36 {
		t.Fatalf("unexpected bytes: %d", record.BytesSent)
	}
}

func TestSafeLineAliasRayWAF(t *testing.T) {
	parser, err := newLogLineParser(config.WebsiteConfig{LogType: "raywaf"}, nil)
	if err != nil {
		t.Fatalf("newLogLineParser(raywaf) error: %v", err)
	}
	if parser.source != "safeline-waf" {
		t.Fatalf("unexpected parser source: %q", parser.source)
	}
}
